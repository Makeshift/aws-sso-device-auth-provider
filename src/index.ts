import { AccountInfo, GetRoleCredentialsCommand, paginateListAccountRoles, paginateListAccounts, RoleCredentials, SSOClient } from '@aws-sdk/client-sso'
import { AuthorizationPendingException, CreateTokenCommand, CreateTokenResponse, ExpiredTokenException, InternalServerException, InvalidClientException, InvalidClientMetadataException, RegisterClientCommand, RegisterClientRequest, RegisterClientResponse, SlowDownException, SSOOIDCClient, SSOOIDCServiceException, StartDeviceAuthorizationCommand, UnauthorizedClientException } from '@aws-sdk/client-sso-oidc'
import { AwsCredentialIdentityProvider } from '@smithy/types'
import Keyv from 'keyv'
import { KeyvFile } from 'keyv-file'
import { minimatch } from 'minimatch'
import { homedir } from 'os'
import { dirname, join } from 'path'
import { MultipleAccountsFoundError } from './error'
import { Either } from './util-types'

export * from './error'
export * from './util-types'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const unixNow = () => Math.floor(Date.now() / 1000)
const unixExpiresInMs = (seconds: number) => seconds * 1000
const unixExpiresAtToExpiresInMs = (unixDate: number) => unixExpiresInMs(unixDate - unixNow())
const msExpiresAtToExpiresInMs = (msDate: number) => msDate - Date.now()

/**
 * @hidden
 */
interface AccountName {
  /**
   * The name of the account to list roles for (can be a {@link https://github.com/isaacs/minimatch | Minimatch}-compatible glob)
   */
  accountName: string
}

/**
 * @hidden
 */
interface AccountId {
  /**
   * The ID of the account to list roles for
   */
  accountId: number | string
}

/**
 * A reference to an account, either by name or by ID
 * @interface
 */
export type AccountRef = Either<AccountName, AccountId>

/**
 * A reference to a role in an account.
 * One of either `roleName` or `accountId` must be provided.
 * @interface
 */
export type RoleNameAndAccountRef = {
  /**
   * Filter the returned list of roles by role name (can be a {@link https://github.com/isaacs/minimatch | Minimatch}-compatible glob)
   */
  roleName: string
} & AccountRef

/**
 * Options for the {@link AwsSsoDeviceAuthProvider} class constructor
 */
export interface AwsSsoDeviceAuthProviderOpts {
  /**
   * The URL to start the SSO login flow
   * @example https://company.awsapps.com/start
   */
  startUrl: string
  /**
   * Options to pass to the {@link RegisterClientCommand}
   */
  registerClientOpts?: Partial<RegisterClientRequest>
  /**
   * Pass your own {@link SSOOIDCClient} instance for us to use.
   */
  ssoOidcClient?: SSOOIDCClient
  /**
   * Pass your own {@link SSOClient} instance for us to use.
   */
  ssoClient?: SSOClient
  /**
   * Pass a custom Keyv store, eg to use a different storage backend
   */
  keyv?: Keyv
}

/**
 * Provides temporary AWS credentials using the AWS SSO device authorization flow.
 */
export class AwsSsoDeviceAuthProvider implements AwsSsoDeviceAuthProviderOpts {

  /**
   * The Keyv store used by this instance to cache tokens and credentials
   */
  keyv: Keyv
  /**
   * The options used by this instance during {@link getOrRegisterClient}
   */
  registerClientOpts?: Partial<RegisterClientRequest>
  /**
   * The URL used by this instance to start the SSO login flow
   */
  startUrl: string
  /**
   * The SSO OIDC client used by this instance
   */
  ssoOidcClient: SSOOIDCClient
  /**
   * The SSO client used by this instance
   */
  ssoClient: SSOClient

  /**
   * Handles some common errors thrown by the SSO OIDC service
   * @param e An error thrown by the SSO OIDC service
   */
  protected async ssoOidcGenericErrorHandler(e: SSOOIDCServiceException): Promise<void> {
    switch (e.constructor) {
      case AuthorizationPendingException:
      case ExpiredTokenException:
        await this.keyv.delete('auth_token')
        this.newAccessToken()
        break
      case InternalServerException:
      case SlowDownException:
        await sleep(5000)
        break
      case InvalidClientException:
      case InvalidClientMetadataException:
      case UnauthorizedClientException:
        await this.keyv.delete('client_registration')
        this.getOrRegisterClient()
        break
    }
    throw e
  }

  /**
   * Returns the SSO OIDC client registration info, registering a new client if necessary
   * @returns The client registration info
   */
  public async getOrRegisterClient(): Promise<RegisterClientResponse> {
    let registrationInfo = await this.keyv.get<RegisterClientResponse>('client_registration')
    if (!registrationInfo || registrationInfo.clientSecretExpiresAt! < unixNow()) {
      const registerClientCommand = new RegisterClientCommand({
        clientName: 'pulumi-aws-sso',
        clientType: 'public',
        ...this.registerClientOpts
      })
      registrationInfo = await this.ssoOidcClient.send(registerClientCommand)
      await this.keyv.set('client_registration', registrationInfo, unixExpiresAtToExpiresInMs(registrationInfo.clientSecretExpiresAt!))
    }
    console.log('Registered client with ID:', registrationInfo.clientId)
    return registrationInfo!
  }

  /**
   * Attempts to refresh the access token using the provided refresh token.
   * On failure, will fall back to requesting new credentials.
   * @param refreshToken The refresh token to use to refresh the access token
   * @returns The new access token
   */
  protected async refreshAccessToken(refreshToken: string): Promise<string> {
    const registrationInfo = await this.getOrRegisterClient()
    try {
      const refreshTokenResponse = await this.ssoOidcClient.send(new CreateTokenCommand({
        clientId: registrationInfo.clientId,
        clientSecret: registrationInfo.clientSecret,
        refreshToken: refreshToken,
        grantType: 'refresh_token',
        scope: ['aws:account:access']
      }))
      await this.keyv.set('auth_token', refreshTokenResponse, unixExpiresInMs(refreshTokenResponse.expiresIn!))
      return refreshTokenResponse.accessToken!
    } catch (e: unknown) {
      if (!(e instanceof SSOOIDCServiceException)) throw e
      return this.ssoOidcGenericErrorHandler(e)
        .then(this.getAccessToken)
    }
  }

  /**
   * Requests a new access token using the device authorization flow
   * @returns The new access token
   */
  protected async newAccessToken(): Promise<string> {
    const registrationInfo = await this.getOrRegisterClient()
    const startDeviceAuthorizationCommand = new StartDeviceAuthorizationCommand({
      clientId: registrationInfo.clientId,
      clientSecret: registrationInfo.clientSecret,
      startUrl: this.startUrl
    })
    const deviceAuthorizationResponse = await this.ssoOidcClient.send(startDeviceAuthorizationCommand)
    await this.keyv.set(`attempted_device_authorization_${registrationInfo.clientId}_${this.startUrl}`, deviceAuthorizationResponse, unixExpiresInMs(deviceAuthorizationResponse.expiresIn!))
    console.log('Please visit', deviceAuthorizationResponse.verificationUriComplete)
    console.log('Now polling for authentication...\n')
    while (true) {
      await sleep(deviceAuthorizationResponse.interval! * 1000)
      process.stdout.write('.')
      try {
        const tokenResponse = await this.ssoOidcClient.send(new CreateTokenCommand({
          clientId: registrationInfo.clientId,
          clientSecret: registrationInfo.clientSecret,
          deviceCode: deviceAuthorizationResponse.deviceCode,
          grantType: 'urn:ietf:params:oauth:grant-type:device_code',
          scope: ['aws:account:access']
        }))
        await this.keyv.set('auth_token', tokenResponse, unixExpiresInMs(tokenResponse.expiresIn!))
        return tokenResponse.accessToken!
      } catch (e: unknown) {
        if (e instanceof AuthorizationPendingException) {
          continue
        } else if (e instanceof SSOOIDCServiceException) {
          return this.ssoOidcGenericErrorHandler(e)
            .then(this.getAccessToken)
        } else {
          throw e
        }
      }
    }
  }

  /**
   * Returns an access token for use with the SSO service.
   * @returns A saved access token, or a refreshed access token if we have a saved refresh token, or a new access token if we have no valid saved tokens.
   */
  public async getAccessToken(): Promise<string> {
    let authTokenResponse = await this.keyv.get<CreateTokenResponse>('auth_token')
    if (!authTokenResponse) {
      return this.newAccessToken()
    } else if (authTokenResponse.refreshToken) {
      return this.refreshAccessToken(authTokenResponse.refreshToken)
    }
    return authTokenResponse!.accessToken!
  }

  /**
   * Returns a list of accounts available to the authenticated user.
   * @param opts
   * @returns A list of account names and numbers matching the provided filters.
   */
  public async getAccounts({ accountId, accountName }: Partial<AccountRef> = {}): Promise<AccountInfo[]> {
    const accountListPaginator = paginateListAccounts({ client: this.ssoClient }, { accessToken: await this.getAccessToken() })
    let accountList: AccountInfo[] = []

    for await (const page of accountListPaginator) {
      accountList.push(...page.accountList!)
    }

    if (accountList.length === 0) {
      throw new Error(`No accounts found ${accountId || accountName ? `matching filters: ${accountId} ${accountName}` : ''}`)
    }

    if (accountId) {
      accountList = accountList.filter((account) => account.accountId! === accountId.toString())
    }
    if (accountName) {
      accountList = accountList.filter((account) => minimatch(account.accountName!, accountName))
    }

    return accountList
  }

  /**
   * Returns the account ID for a single account with the given name. If multiple accounts are found, an error is thrown.
   * @param accountName Filter the list of accounts by account name (can be a {@link https://github.com/isaacs/minimatch | Minimatch}-compatible glob)
   * @returns The account ID of the account with the given name
   * @throws {@link MultipleAccountsFoundError} if more than one account is found with the given name
   */
  public async getSingleAccountIdByName(accountName: string): Promise<string> {
    const accounts = await this.getAccounts({ accountName })
    if (accounts.length > 1) {
      throw new MultipleAccountsFoundError(accountName, accounts)
    }
    return accounts[0].accountId!
  }

  /**
   * Returns a list of roles available to the authenticated user for a given account ref.
   * @param opts
   * @returns An array of role names matching the provided filters, or all roles if no filters are provided.
   */
  public async getRolesForAccount({ accountId, accountName, roleName }: Partial<RoleNameAndAccountRef>): Promise<string[]> {
    if (!accountId && !accountName) {
      throw new Error('Either accountId or accountName must be provided')
    }
    if (!accountId) {
      accountId = await this.getSingleAccountIdByName(accountName!)
    }

    const accountRolePaginator = paginateListAccountRoles({ client: this.ssoClient }, { accessToken: await this.getAccessToken(), accountId: accountId.toString() })
    let accountRoles: string[] = []

    for await (const page of accountRolePaginator) {
      accountRoles.push(...page.roleList!.map((role) => role.roleName!))
    }

    if (accountRoles.length === 0) {
      throw new Error(`No roles found for account ${accountId}`)
    }

    if (roleName) {
      accountRoles = accountRoles.filter(minimatch.filter(roleName))
    }

    return accountRoles
  }

  /**
   * Returns temporary credentials for a given role in a given account.
   * @param opts
   */
  public async getCredentialsForRole({ accountId, accountName, roleName }: RoleNameAndAccountRef): Promise<Required<RoleCredentials>> {
    if (!accountId && !accountName) {
      throw new Error('Either accountId or accountName must be provided')
    }
    if (!accountId) {
      accountId = await this.getSingleAccountIdByName(accountName!)
    }

    let credentials = await this.keyv.get<RoleCredentials>(`role_credentials_${accountId}_${roleName}`)

    if (!credentials) {
      const response = await this.ssoClient.send(new GetRoleCredentialsCommand({
        accessToken: await this.getAccessToken(),
        accountId: accountId.toString(),
        roleName: roleName
      }))

      this.keyv.set(`role_credentials_${accountId}_${roleName}`, response.roleCredentials, msExpiresAtToExpiresInMs(response.roleCredentials!.expiration!))

      credentials = response.roleCredentials
    }

    return credentials as Required<RoleCredentials>
  }

  /**
   * Convenience static method to return {@link RoleCredentials} for a given role in a given account using the given startURL in a single call.
   * @see {@link AwsSsoDeviceAuthProvider.getCredentialsForRole}
   */
  public static async getCredentialsForRole(opts: AwsSsoDeviceAuthProviderOpts & RoleNameAndAccountRef): Promise<Required<RoleCredentials>> {
    const provider = new AwsSsoDeviceAuthProvider(opts)
    return provider.getCredentialsForRole(opts)
  }

  /**
   * Returns an {@link AwsCredentialIdentityProvider} that can be used to provide credentials for a given role in a given account.
   * Can be used to provide credentials to the AWS SDK
   * @example
   * ```ts
   *   import { S3Client } from '@aws-sdk/client-s3'
   *   import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'
   *
   *  const provider = new AwsSsoDeviceAuthProvider({
   *   startUrl: 'https://echobox.awsapps.com/start'
   *  })
   *
   *   const s3Client = new S3Client({
   *     credentials: await provider.getAwsCredentialIdentityProviderForRole({
   *       accountId: '123456789012',
   *       roleName: 'MyRole'
   *     })
   *   })
   * ```
   * @param opts
   */
  public async getAwsCredentialIdentityProviderForRole({ roleName, accountId, accountName }: RoleNameAndAccountRef): Promise<AwsCredentialIdentityProvider> {
    return async () => {
      const credentials = await this.getCredentialsForRole({ roleName, accountId, accountName } as RoleNameAndAccountRef)
      return {
        ...credentials,
        // It randomly wants an actual date here instead of a unix time like the rest of the SDK
        expiration: new Date(credentials.expiration)
      }
    }
  }

  /**
   * Convenience static method to create an {@link AwsCredentialIdentityProvider} for a given role in a given account using the given startURL in a single call.
   * @see {@link getAwsCredentialIdentityProviderForRole}
   * @see {@link AwsSsoDeviceAuthProvider}
   */
  public static async getAwsCredentialIdentityProviderForRole(opts: AwsSsoDeviceAuthProviderOpts & RoleNameAndAccountRef): Promise<AwsCredentialIdentityProvider> {
    const provider = new AwsSsoDeviceAuthProvider(opts)
    return provider.getAwsCredentialIdentityProviderForRole(opts)
  }

  constructor(opts: AwsSsoDeviceAuthProviderOpts) {
    this.registerClientOpts = opts.registerClientOpts
    this.startUrl = opts.startUrl

    this.ssoOidcClient = opts.ssoOidcClient ?? new SSOOIDCClient({
      region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'eu-west-1'
    })

    this.ssoClient = opts.ssoClient ?? new SSOClient({
      region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'eu-west-1'
    })

    const defaultFileDir = (process.env.AWS_SHARED_CREDENTIALS_FILE || process.env.AWS_CONFIG_FILE) ? dirname(process.env.AWS_SHARED_CREDENTIALS_FILE! ?? process.env.AWS_CONFIG_FILE!) : join(homedir(), '.aws')
    this.keyv = opts.keyv ?? new Keyv({
      store: new KeyvFile({
        filename: join(defaultFileDir, 'aws-sso-device-auth.json')
      })
    })
  }
}
