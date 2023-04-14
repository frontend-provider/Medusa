# Class: SwapService

Handles swaps

## Hierarchy

- `TransactionBaseService`

  ↳ **`SwapService`**

## Constructors

### constructor

• **new SwapService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/swap.ts:92](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L92)

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

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[medusa/src/services/swap.ts:78](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L78)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[medusa/src/services/swap.ts:88](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L88)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/swap.ts:79](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L79)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[medusa/src/services/swap.ts:84](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L84)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[medusa/src/services/swap.ts:87](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L87)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/swap.ts:83](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L83)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[medusa/src/services/swap.ts:80](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L80)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/swap.ts:86](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L86)

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/swap.ts:90](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L90)

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[medusa/src/services/swap.ts:81](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L81)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/swap.ts:85](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L85)

___

### swapRepository\_

• `Protected` `Readonly` **swapRepository\_**: `Repository`<`Swap`\>

#### Defined in

[medusa/src/services/swap.ts:76](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L76)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/swap.ts:82](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L82)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PAYMENT_COMPLETED` | `string` |
| `PROCESS_REFUND_FAILED` | `string` |
| `RECEIVED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |

#### Defined in

[medusa/src/services/swap.ts:64](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L64)

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

### areReturnItemsValid

▸ `Protected` **areReturnItemsValid**(`returnItems`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnItems` | `WithRequiredProperty`<`Partial`<`ReturnItem`\>, ``"item_id"``\>[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[medusa/src/services/swap.ts:1219](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L1219)

___

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

▸ **cancel**(`swapId`): `Promise`<`Swap`\>

Cancels a given swap if possible. A swap can only be canceled if all
related returns, fulfillments, and payments have been canceled. If a swap
is associated with a refund, it cannot be canceled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to cancel. |

#### Returns

`Promise`<`Swap`\>

the canceled swap.

#### Defined in

[medusa/src/services/swap.ts:837](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L837)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`Swap`\>

Cancels a fulfillment (if related to a swap)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<`Swap`\>

updated swap

#### Defined in

[medusa/src/services/swap.ts:1038](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L1038)

___

### create

▸ **create**(`order`, `returnItems`, `additionalItems?`, `returnShipping?`, `custom?`): `Promise`<`Swap`\>

Creates a swap from an order, with given return items, additional items
and an optional return shipping method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to base the swap off |
| `returnItems` | `WithRequiredProperty`<`Partial`<`ReturnItem`\>, ``"item_id"``\>[] | the items to return in the swap |
| `additionalItems?` | `Pick`<`LineItem`, ``"variant_id"`` \| ``"quantity"``\>[] | the items to send to the customer |
| `returnShipping?` | `Object` | an optional shipping method for returning the returnItems |
| `returnShipping.option_id` | `string` | - |
| `returnShipping.price?` | `number` | - |
| `custom` | `Object` | contains relevant custom information. This object may  include no_notification which will disable sending notification when creating  swap. If set, it overrules the attribute inherited from the order |
| `custom.allow_backorder?` | `boolean` | - |
| `custom.idempotency_key?` | `string` | - |
| `custom.location_id?` | `string` | - |
| `custom.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Swap`\>

the newly created swap

#### Defined in

[medusa/src/services/swap.ts:302](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L302)

___

### createCart

▸ **createCart**(`swapId`, `customShippingOptions?`): `Promise`<`Swap`\>

Creates a cart from the given swap. The cart can be used to pay
for differences associated with the swap. The swap represented by the
swapId must belong to the order. Fails if there is already a cart on the
swap.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `swapId` | `string` | `undefined` | the id of the swap to create the cart from |
| `customShippingOptions` | { `option_id`: `string` ; `price`: `number`  }[] | `[]` | the shipping options |

#### Returns

`Promise`<`Swap`\>

the swap with its cart_id prop set to the id of the new cart.

#### Defined in

[medusa/src/services/swap.ts:558](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L558)

___

### createFulfillment

▸ **createFulfillment**(`swapId`, `config?`): `Promise`<`Swap`\>

Fulfills the additional items associated with the swap. Will call the
fulfillment providers associated with the shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to fulfill, |
| `config` | `CreateShipmentConfig` | optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new status and fulfillments.

#### Defined in

[medusa/src/services/swap.ts:899](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L899)

___

### createShipment

▸ **createShipment**(`swapId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Swap`\>

Marks a fulfillment as shipped and attaches tracking numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap that has been shipped. |
| `fulfillmentId` | `string` | the id of the specific fulfillment that has been shipped |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | the tracking numbers associated with the shipment |
| `config` | `CreateShipmentConfig` | optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new fulfillments and status.

#### Defined in

[medusa/src/services/swap.ts:1069](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L1069)

___

### deleteMetadata

▸ **deleteMetadata**(`swapId`, `key`): `Promise`<`Swap`\>

Dedicated method to delete metadata for a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`Swap`\>

resolves to the updated result.

#### Defined in

[medusa/src/services/swap.ts:1147](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L1147)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Swap`[]\>

List swaps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Swap`\> | the query object for find |
| `config` | `FindConfig`<`Swap`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`Swap`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/swap.ts:274](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L274)

___

### processDifference

▸ **processDifference**(`swapId`): `Promise`<`Swap`\>

Process difference for the requested swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap being processed |

#### Returns

`Promise`<`Swap`\>

processed swap

#### Defined in

[medusa/src/services/swap.ts:402](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L402)

___

### registerCartCompletion

▸ **registerCartCompletion**(`swapId`): `Promise`<`Swap`\>

Register a cart completion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | The id of the swap |

#### Returns

`Promise`<`Swap`\>

swap related to the cart

#### Defined in

[medusa/src/services/swap.ts:704](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L704)

___

### registerReceived

▸ **registerReceived**(`id`): `Promise`<`Swap`\>

Registers the swap return items as received so that they cannot be used
as a part of other swaps/returns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id of the order with the swap. |

#### Returns

`Promise`<`Swap`\>

the resulting order

#### Defined in

[medusa/src/services/swap.ts:1185](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L1185)

___

### retrieve

▸ **retrieve**(`swapId`, `config?`): `Promise`<`Swap`\>

Retrieves a swap with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to retrieve |
| `config` | `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } | the configuration to retrieve the swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[medusa/src/services/swap.ts:204](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L204)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `relations?`): `Promise`<`Swap`\>

Retrieves a swap based on its associated cart id

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartId` | `string` | `undefined` | the cart id that the swap's cart has |
| `relations` | `undefined` \| `string`[] | `[]` | the relations to retrieve swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[medusa/src/services/swap.ts:247](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L247)

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

### transformQueryForCart

▸ `Protected` **transformQueryForCart**(`config`): `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof `Cart`[]  }

Transform find config object for retrieval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } | parsed swap find config |

#### Returns

`Omit`<`FindConfig`<`Swap`\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof `Cart`[]  }

transformed find swap config

#### Defined in

[medusa/src/services/swap.ts:131](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L131)

___

### update

▸ **update**(`swapId`, `update`): `Promise`<`Swap`\>

Update the swap record.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap to update |
| `update` | `Partial`<`Swap`\> | new data |

#### Returns

`Promise`<`Swap`\>

updated swap record

#### Defined in

[medusa/src/services/swap.ts:525](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/swap.ts#L525)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SwapService`](SwapService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SwapService`](SwapService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
