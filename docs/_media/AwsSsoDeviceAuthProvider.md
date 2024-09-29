[**aws-sso-device-auth-provider**](../README.md) • **Docs**

***

[aws-sso-device-auth-provider](../globals.md) / AwsSsoDeviceAuthProvider

# Class: AwsSsoDeviceAuthProvider

Provides temporary AWS credentials using the AWS SSO device authorization flow.

## Implements

- [`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md)

## Constructors

### new AwsSsoDeviceAuthProvider()

> **new AwsSsoDeviceAuthProvider**(`opts`): [`AwsSsoDeviceAuthProvider`](AwsSsoDeviceAuthProvider.md)

#### Parameters

• **opts**: [`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md)

#### Returns

[`AwsSsoDeviceAuthProvider`](AwsSsoDeviceAuthProvider.md)

#### Defined in

[src/index.ts:387](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L387)

## Properties

### keyv

> **keyv**: `Keyv`

The Keyv store used by this instance to cache tokens and credentials

#### Implementation of

[`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md).[`keyv`](../interfaces/AwsSsoDeviceAuthProviderOpts.md#keyv)

#### Defined in

[src/index.ts:94](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L94)

***

### registerClientOpts?

> `optional` **registerClientOpts**: `Partial`\<`RegisterClientRequest`\>

The options used by this instance during [getOrRegisterClient](AwsSsoDeviceAuthProvider.md#getorregisterclient)

#### Implementation of

[`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md).[`registerClientOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md#registerclientopts)

#### Defined in

[src/index.ts:98](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L98)

***

### ssoClient

> **ssoClient**: `SSOClient`

The SSO client used by this instance

#### Implementation of

[`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md).[`ssoClient`](../interfaces/AwsSsoDeviceAuthProviderOpts.md#ssoclient)

#### Defined in

[src/index.ts:110](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L110)

***

### ssoOidcClient

> **ssoOidcClient**: `SSOOIDCClient`

The SSO OIDC client used by this instance

#### Implementation of

[`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md).[`ssoOidcClient`](../interfaces/AwsSsoDeviceAuthProviderOpts.md#ssooidcclient)

#### Defined in

[src/index.ts:106](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L106)

***

### startUrl

> **startUrl**: `string`

The URL used by this instance to start the SSO login flow

#### Implementation of

[`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md).[`startUrl`](../interfaces/AwsSsoDeviceAuthProviderOpts.md#starturl)

#### Defined in

[src/index.ts:102](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L102)

## Methods

### getAccessToken()

> **getAccessToken**(): `Promise`\<`string`\>

Returns an access token for use with the SSO service.

#### Returns

`Promise`\<`string`\>

A saved access token, or a refreshed access token if we have a saved refresh token, or a new access token if we have no valid saved tokens.

#### Defined in

[src/index.ts:225](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L225)

***

### getAccounts()

> **getAccounts**(`opts`): `Promise`\<`AccountInfo`[]\>

Returns a list of accounts available to the authenticated user.

#### Parameters

• **opts**: `Partial`\<[`AccountRef`](../interfaces/AccountRef.md)\> = `{}`

#### Returns

`Promise`\<`AccountInfo`[]\>

A list of account names and numbers matching the provided filters.

#### Defined in

[src/index.ts:240](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L240)

***

### getAwsCredentialIdentityProviderForRole()

> **getAwsCredentialIdentityProviderForRole**(`opts`): `Promise`\<`AwsCredentialIdentityProvider`\>

Returns an AwsCredentialIdentityProvider that can be used to provide credentials for a given role in a given account.
Can be used to provide credentials to the AWS SDK

#### Parameters

• **opts**: [`RoleNameAndAccountRef`](../interfaces/RoleNameAndAccountRef.md)

#### Returns

`Promise`\<`AwsCredentialIdentityProvider`\>

#### Example

```ts
  import { S3Client } from '@aws-sdk/client-s3'
  import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'

 const provider = new AwsSsoDeviceAuthProvider({
  startUrl: 'https://echobox.awsapps.com/start'
 })

  const s3Client = new S3Client({
    credentials: await provider.getAwsCredentialIdentityProviderForRole({
      accountId: '123456789012',
      roleName: 'MyRole'
    })
  })
```

#### Defined in

[src/index.ts:366](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L366)

***

### getCredentialsForRole()

> **getCredentialsForRole**(`opts`): `Promise`\<`Required`\<`RoleCredentials`\>\>

Returns temporary credentials for a given role in a given account.

#### Parameters

• **opts**: [`RoleNameAndAccountRef`](../interfaces/RoleNameAndAccountRef.md)

#### Returns

`Promise`\<`Required`\<`RoleCredentials`\>\>

#### Defined in

[src/index.ts:311](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L311)

***

### getOrRegisterClient()

> **getOrRegisterClient**(): `Promise`\<`RegisterClientResponse`\>

Returns the SSO OIDC client registration info, registering a new client if necessary

#### Returns

`Promise`\<`RegisterClientResponse`\>

The client registration info

#### Defined in

[src/index.ts:141](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L141)

***

### getRolesForAccount()

> **getRolesForAccount**(`opts`): `Promise`\<`string`[]\>

Returns a list of roles available to the authenticated user for a given account ref.

#### Parameters

• **opts**: `Partial`\<[`RoleNameAndAccountRef`](../interfaces/RoleNameAndAccountRef.md)\>

#### Returns

`Promise`\<`string`[]\>

An array of role names matching the provided filters, or all roles if no filters are provided.

#### Defined in

[src/index.ts:281](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L281)

***

### getSingleAccountIdByName()

> **getSingleAccountIdByName**(`accountName`): `Promise`\<`string`\>

Returns the account ID for a single account with the given name. If multiple accounts are found, an error is thrown.

#### Parameters

• **accountName**: `string`

Filter the list of accounts by account name (can be a [Minimatch](https://github.com/isaacs/minimatch)-compatible glob)

#### Returns

`Promise`\<`string`\>

The account ID of the account with the given name

#### Throws

[MultipleAccountsFoundError](MultipleAccountsFoundError.md) if more than one account is found with the given name

#### Defined in

[src/index.ts:268](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L268)

***

### newAccessToken()

> `protected` **newAccessToken**(): `Promise`\<`string`\>

Requests a new access token using the device authorization flow

#### Returns

`Promise`\<`string`\>

The new access token

#### Defined in

[src/index.ts:185](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L185)

***

### refreshAccessToken()

> `protected` **refreshAccessToken**(`refreshToken`): `Promise`\<`string`\>

Attempts to refresh the access token using the provided refresh token.
On failure, will fall back to requesting new credentials.

#### Parameters

• **refreshToken**: `string`

The refresh token to use to refresh the access token

#### Returns

`Promise`\<`string`\>

The new access token

#### Defined in

[src/index.ts:162](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L162)

***

### ssoOidcGenericErrorHandler()

> `protected` **ssoOidcGenericErrorHandler**(`e`): `Promise`\<`void`\>

Handles some common errors thrown by the SSO OIDC service

#### Parameters

• **e**: `SSOOIDCServiceException`

An error thrown by the SSO OIDC service

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/index.ts:116](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L116)

***

### getAwsCredentialIdentityProviderForRole()

> `static` **getAwsCredentialIdentityProviderForRole**(`opts`): `Promise`\<`AwsCredentialIdentityProvider`\>

Convenience static method to create an AwsCredentialIdentityProvider for a given role in a given account using the given startURL in a single call.

#### Parameters

• **opts**: [`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md) & [`RoleNameAndAccountRef`](../interfaces/RoleNameAndAccountRef.md)

#### Returns

`Promise`\<`AwsCredentialIdentityProvider`\>

#### See

 - [getAwsCredentialIdentityProviderForRole](AwsSsoDeviceAuthProvider.md#getawscredentialidentityproviderforrole-1)
 - [AwsSsoDeviceAuthProvider](AwsSsoDeviceAuthProvider.md)

#### Defined in

[src/index.ts:382](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L382)

***

### getCredentialsForRole()

> `static` **getCredentialsForRole**(`opts`): `Promise`\<`Required`\<`RoleCredentials`\>\>

Convenience static method to return RoleCredentials for a given role in a given account using the given startURL in a single call.

#### Parameters

• **opts**: [`AwsSsoDeviceAuthProviderOpts`](../interfaces/AwsSsoDeviceAuthProviderOpts.md) & [`RoleNameAndAccountRef`](../interfaces/RoleNameAndAccountRef.md)

#### Returns

`Promise`\<`Required`\<`RoleCredentials`\>\>

#### See

[AwsSsoDeviceAuthProvider.getCredentialsForRole](AwsSsoDeviceAuthProvider.md#getcredentialsforrole-1)

#### Defined in

[src/index.ts:340](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L340)
