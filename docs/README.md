**aws-sso-device-auth-provider** • [**Docs**](globals.md)

***

# AWS SSO Device Authorization Grant Provider

This package provides a simple way to get credentials for AWS services using the AWS SSO device authorization grant flow. This is useful for CLI tools that need to access AWS services on behalf of a user.

If you've ever used `aws sso login` to get credentials for the AWS CLI, this package does the same thing, but doesn't require the AWS CLI to be installed and can be configured programmatically.

Thanks to [this fantastic blog post](https://medium.com/@lex.berger/anatomy-of-aws-sso-device-authorization-grant-2839008c367a) by Alex Berger for the explanation of how AWS SSO device authorization grants work.

## Installation

Yarn: `yarn add aws-sso-device-auth-provider`

Npm: `npm install aws-sso-device-auth-provider`

## Requirements

- The user intending to execute the AWS SSO Device Authorization flow must have an AWS SSO account with access to one or more AWS accounts.
- The user must also have a browser available to complete the device authorization flow. They will be prompted to visit a URL.

That's it. No AWS CLI or other tools are required.

## Usage

There is a convenience function to avoid needing to instantiate an instance of the `AwsSsoDeviceAuthProvider` class if you only need to get credentials once and you already know the role you want to assume:

```ts
import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: 'eu-west-1',
  credentials: await AwsSsoDeviceAuthProvider.getAwsCredentialIdentityProviderForRole({
    startUrl: 'https://echobox.awsapps.com/start',
    accountId: '060610571733',
    roleName: 'AWSReadOnlyAccess'
  })
})

console.log(await s3Client.send(new ListBucketsCommand({})))
```

Alternatively, you can instantiate the `AwsSsoDeviceAuthProvider` class and use it to get information about the user's AWS accounts and roles:

```ts
import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"

const provider = new AwsSsoDeviceAuthProvider({
  startUrl: 'https://echobox.awsapps.com/start'
})

// Optional filters - with support for globs
const accounts = await provider.getAccounts({accountName: 'staging-*'})
const rolesForFirstAccount = await provider.getRolesForAccount({accountId: accounts[0].accountId, roleName: '*ReadOnly*'})

const credentials = await provider.getAwsCredentialIdentityProviderForRole({
  accountId: accounts[0].accountId,
  roleName: rolesForFirstAccount[0].roleName
})

// It caches the credentials based on the expiry time in the response,
//  so this following call would return the same credentials
const s3Client = new S3Client({
  region: 'eu-west-1',
  credentials: provider.getAwsCredentialIdentityProviderForRole({
    accountId: '060610571733',
    roleName: 'AWSReadOnlyAccess'
  })
})
```
