[**aws-sso-device-auth-provider**](../README.md) • **Docs**

***

[aws-sso-device-auth-provider](../globals.md) / MultipleAccountsFoundError

# Class: MultipleAccountsFoundError

## Extends

- [`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md)

## Constructors

### new MultipleAccountsFoundError()

> **new MultipleAccountsFoundError**(`searchName`, `accountsFound`): [`MultipleAccountsFoundError`](MultipleAccountsFoundError.md)

#### Parameters

• **searchName**: `string`

• **accountsFound**: `AccountInfo`[]

#### Returns

[`MultipleAccountsFoundError`](MultipleAccountsFoundError.md)

#### Overrides

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`constructor`](AwsSsoDeviceAuthProviderError.md#constructors)

#### Defined in

[src/error.ts:11](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/627ac68abb82828067ed511c54022a5789d01ce6/src/error.ts#L11)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`cause`](AwsSsoDeviceAuthProviderError.md#cause)

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`message`](AwsSsoDeviceAuthProviderError.md#message)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`name`](AwsSsoDeviceAuthProviderError.md#name)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`stack`](AwsSsoDeviceAuthProviderError.md#stack)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`prepareStackTrace`](AwsSsoDeviceAuthProviderError.md#preparestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:98

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`stackTraceLimit`](AwsSsoDeviceAuthProviderError.md#stacktracelimit)

#### Defined in

node\_modules/@types/node/globals.d.ts:100

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md).[`captureStackTrace`](AwsSsoDeviceAuthProviderError.md#capturestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:91
