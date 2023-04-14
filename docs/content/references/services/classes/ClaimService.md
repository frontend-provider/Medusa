# Class: ClaimService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ClaimService`**

## Constructors

### constructor

• **new ClaimService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/claim.ts:86](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L86)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<`Address`\>

#### Defined in

[medusa/src/services/claim.ts:68](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L68)

___

### claimItemService\_

• `Protected` `Readonly` **claimItemService\_**: [`ClaimItemService`](ClaimItemService.md)

#### Defined in

[medusa/src/services/claim.ts:72](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L72)

___

### claimRepository\_

• `Protected` `Readonly` **claimRepository\_**: `Repository`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:69](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L69)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/claim.ts:73](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L73)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/claim.ts:74](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L74)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[medusa/src/services/claim.ts:75](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L75)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<`LineItem`\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<`LineItem` & { `return_item`: `ReturnItem`  }[]\>  }

#### Defined in

[medusa/src/services/claim.ts:71](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L71)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/claim.ts:76](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L76)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/claim.ts:77](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L77)

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/claim.ts:84](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L84)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/claim.ts:78](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L78)

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[medusa/src/services/claim.ts:79](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L79)

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: `Repository`<`ShippingMethod`\>

#### Defined in

[medusa/src/services/claim.ts:70](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L70)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/claim.ts:80](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L80)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/claim.ts:81](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L81)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/claim.ts:82](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L82)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/claim.ts:59](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L59)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancel

▸ **cancel**(`id`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:813](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L813)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentId` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:661](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L661)

___

### create

▸ **create**(`data`): `Promise`<`ClaimOrder`\>

Creates a Claim on an Order. Claims consists of items that are claimed and
optionally items to be sent as replacement for the claimed items. The
shipping address that the new items will be shipped to

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateClaimInput` | the object containing all data required to create a claim |

#### Returns

`Promise`<`ClaimOrder`\>

created claim

#### Defined in

[medusa/src/services/claim.ts:331](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L331)

___

### createFulfillment

▸ **createFulfillment**(`id`, `config?`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the object containing all data required to create a claim |
| `config` | `Object` | config object |
| `config.location_id?` | `string` | - |
| `config.metadata?` | `Record`<`string`, `unknown`\> | config metadata |
| `config.no_notification?` | `boolean` | config no notification |

#### Returns

`Promise`<`ClaimOrder`\>

created claim

#### Defined in

[medusa/src/services/claim.ts:512](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L512)

___

### createShipment

▸ **createShipment**(`id`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `fulfillmentId` | `string` | `undefined` |
| `trackingLinks` | { `tracking_number`: `string`  }[] | `[]` |
| `config` | `Object` | `undefined` |
| `config.metadata` | `Object` | `{}` |
| `config.no_notification` | `undefined` | `undefined` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:733](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L733)

___

### getRefundTotalForClaimLinesOnOrder

▸ `Protected` **getRefundTotalForClaimLinesOnOrder**(`order`, `claimItems`): `Promise`<`number`\>

Finds claim line items on an order and calculates the refund amount.
There are three places too look:
- Order items
- Swap items
- Claim items (from previous claims)
Note, it will attempt to return early from each of these places to avoid having to iterate over all items every time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to find claim lines on |
| `claimItems` | `CreateClaimItemInput`[] | the claim items to match against |

#### Returns

`Promise`<`number`\>

the refund amount

#### Defined in

[medusa/src/services/claim.ts:273](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L273)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ClaimOrder`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `FindConfig`<`ClaimOrder`\> | the config object containing query settings |

#### Returns

`Promise`<`ClaimOrder`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/claim.ts:869](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L869)

___

### processRefund

▸ **processRefund**(`id`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:687](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L687)

___

### retrieve

▸ **retrieve**(`claimId`, `config?`): `Promise`<`ClaimOrder`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `claimId` | `string` | id of the claim order to retrieve |
| `config` | `FindConfig`<`ClaimOrder`\> | the config object containing query settings |

#### Returns

`Promise`<`ClaimOrder`\>

the order document

#### Defined in

[medusa/src/services/claim.ts:888](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L888)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `data`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateClaimInput` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[medusa/src/services/claim.ts:125](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L125)

___

### validateCreateClaimInput

▸ `Protected` **validateCreateClaimInput**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateClaimInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/claim.ts:206](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/claim.ts#L206)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimService`](ClaimService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimService`](ClaimService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
