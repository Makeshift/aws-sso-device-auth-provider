[**aws-sso-device-auth-provider**](../README.md) • **Docs**

***

[aws-sso-device-auth-provider](../globals.md) / AwsSsoDeviceAuthProviderError

# Class: AwsSsoDeviceAuthProviderError

## Extends

- `Error`

## Extended by

- [`MultipleAccountsFoundError`](MultipleAccountsFoundError.md)

## Constructors

### new AwsSsoDeviceAuthProviderError()

> **new AwsSsoDeviceAuthProviderError**(`message`): [`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md)

#### Parameters

• **message**: `string`

#### Returns

[`AwsSsoDeviceAuthProviderError`](AwsSsoDeviceAuthProviderError.md)

#### Overrides

`Error.constructor`

#### Defined in

[src/error.ts:4](https://github.com/Makeshift/aws-sso-device-auth-provider/blob/ce03dd5981e003816ff40106aeb33fb5cd73087b/src/error.ts#L4)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:98

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:91
