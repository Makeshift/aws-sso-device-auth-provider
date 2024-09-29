[**aws-sso-device-auth-provider**](../README.md) • **Docs**

***

[aws-sso-device-auth-provider](../globals.md) / AccountRef

# Interface: AccountRef

A reference to an account, either by name or by ID

## Properties

### accountId?

> `optional` **accountId**: `string` \| `number`

The ID of the account to list roles for

#### Defined in

[src/index.ts:38](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L38)

***

### accountName?

> `optional` **accountName**: `string`

The name of the account to list roles for (can be a [Minimatch](https://github.com/isaacs/minimatch)-compatible glob)

#### Defined in

[src/index.ts:28](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/index.ts#L28)
