[**aws-sso-device-auth-provider**](../README.md) • **Docs**

***

[aws-sso-device-auth-provider](../globals.md) / AwsSsoDeviceAuthProviderOpts

# Interface: AwsSsoDeviceAuthProviderOpts

Options for the [AwsSsoDeviceAuthProvider](../classes/AwsSsoDeviceAuthProvider.md) class constructor

## Properties

### keyv?

> `optional` **keyv**: `Keyv`

Pass a custom Keyv store, eg to use a different storage backend

#### Defined in

[src/index.ts:83](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L83)

***

### registerClientOpts?

> `optional` **registerClientOpts**: `Partial`\<`RegisterClientRequest`\>

Options to pass to the RegisterClientCommand

#### Defined in

[src/index.ts:71](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L71)

***

### ssoClient?

> `optional` **ssoClient**: `SSOClient`

Pass your own SSOClient instance for us to use.

#### Defined in

[src/index.ts:79](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L79)

***

### ssoOidcClient?

> `optional` **ssoOidcClient**: `SSOOIDCClient`

Pass your own SSOOIDCClient instance for us to use.

#### Defined in

[src/index.ts:75](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L75)

***

### startUrl

> **startUrl**: `string`

The URL to start the SSO login flow

#### Example

```ts
https://company.awsapps.com/start
```

#### Defined in

[src/index.ts:67](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L67)
