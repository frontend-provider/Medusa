# Class: ReturnService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ReturnService`**

## Constructors

### constructor

• **new ReturnService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/return.ts:64](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L64)

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

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/return.ts:58](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L58)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/return.ts:55](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L55)

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

[medusa/src/services/return.ts:60](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L60)

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/return.ts:62](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L62)

___

### returnItemRepository\_

• `Protected` `Readonly` **returnItemRepository\_**: `Repository`<`ReturnItem`\>

#### Defined in

[medusa/src/services/return.ts:54](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L54)

___

### returnReasonService\_

• `Protected` `Readonly` **returnReasonService\_**: [`ReturnReasonService`](ReturnReasonService.md)

#### Defined in

[medusa/src/services/return.ts:59](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L59)

___

### returnRepository\_

• `Protected` `Readonly` **returnRepository\_**: `Repository`<`Return`\>

#### Defined in

[medusa/src/services/return.ts:53](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L53)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/return.ts:57](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L57)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/return.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L56)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/return.ts:52](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L52)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

▸ **cancel**(`returnId`): `Promise`<`Return`\>

Cancels a return if possible. Returns can be canceled if it has not been received.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id of the return to cancel. |

#### Returns

`Promise`<`Return`\>

the updated Return

#### Defined in

[medusa/src/services/return.ts:161](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L161)

___

### create

▸ **create**(`data`): `Promise`<`Return`\>

Creates a return request for an order, with given items, and a shipping
method. If no refund amount is provided the refund amount is calculated from
the return lines and the shipping cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateReturnInput` | data to use for the return e.g. shipping_method,    items or refund_amount |

#### Returns

`Promise`<`Return`\>

the created return

#### Defined in

[medusa/src/services/return.ts:346](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L346)

___

### fulfill

▸ **fulfill**(`returnId`): `Promise`<`Return`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `string` |

#### Returns

`Promise`<`Return`\>

#### Defined in

[medusa/src/services/return.ts:490](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L490)

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<`LineItem` & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

Retrieves the order line items, given an array of items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to get line items from |
| `items` | `OrdersReturnItem`[] | the items to get |
| `transformer` | `Transformer` | a function to apply to each of the items    retrieved from the order, should return a line item. If the transformer    returns an undefined value the line item will be filtered from the    returned array. |

#### Returns

`Promise`<`LineItem` & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

the line items generated by the transformer.

#### Defined in

[medusa/src/services/return.ts:101](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L101)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Return`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Return`\> | the query object for find |
| `config` | `FindConfig`<`Return`\> | the config object for find |

#### Returns

`Promise`<`Return`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/return.ts:141](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L141)

___

### receive

▸ **receive**(`returnId`, `receivedItems`, `refundAmount?`, `allowMismatch?`, `context?`): `Promise`<`Return`\>

Registers a previously requested return as received. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in sitautions where a custom refund amount is requested, but the
retuned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `returnId` | `string` | `undefined` | the orderId to return to |
| `receivedItems` | `OrdersReturnItem`[] | `undefined` | the items received after return. |
| `refundAmount?` | `number` | `undefined` | the amount to return |
| `allowMismatch` | `boolean` | `false` | whether to ignore return/received product mismatch |
| `context` | `Object` | `{}` | - |
| `context.locationId?` | `string` | `undefined` | - |

#### Returns

`Promise`<`Return`\>

the result of the update operation

#### Defined in

[medusa/src/services/return.ts:561](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L561)

___

### retrieve

▸ **retrieve**(`returnId`, `config?`): `Promise`<`Return`\>

Retrieves a return by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id of the return to retrieve |
| `config` | `FindConfig`<`Return`\> | the config object |

#### Returns

`Promise`<`Return`\>

the return

#### Defined in

[medusa/src/services/return.ts:259](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L259)

___

### retrieveBySwap

▸ **retrieveBySwap**(`swapId`, `relations?`): `Promise`<`Return`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `swapId` | `string` | `undefined` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`Return`\>

#### Defined in

[medusa/src/services/return.ts:287](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L287)

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

▸ **update**(`returnId`, `update`): `Promise`<`Return`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `string` |
| `update` | `UpdateReturnInput` |

#### Returns

`Promise`<`Return`\>

#### Defined in

[medusa/src/services/return.ts:312](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L312)

___

### validateReturnLineItem

▸ `Protected` **validateReturnLineItem**(`item?`, `quantity?`, `additional?`): `DeepPartial`<`LineItem`\>

Checks that a given quantity of a line item can be returned. Fails if the
item is undefined or if the returnable quantity of the item is lower, than
the quantity that is requested to be returned.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `item?` | `LineItem` | `undefined` | the line item to check has sufficient returnable   quantity. |
| `quantity` | `number` | `0` | the quantity that is requested to be returned. |
| `additional` | `Object` | `{}` | the quantity that is requested to be returned. |
| `additional.note?` | `string` | `undefined` | - |
| `additional.reason_id?` | `string` | `undefined` | - |

#### Returns

`DeepPartial`<`LineItem`\>

a line item where the quantity is set to the requested
  return quantity.

#### Defined in

[medusa/src/services/return.ts:217](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L217)

___

### validateReturnStatuses

▸ `Protected` **validateReturnStatuses**(`order`): `void`

Checks that an order has the statuses necessary to complete a return.
fulfillment_status cannot be not_fulfilled or returned.
payment_status must be captured.

**`Throws`**

when statuses are not sufficient for returns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to check statuses on |

#### Returns

`void`

#### Defined in

[medusa/src/services/return.ts:187](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/return.ts#L187)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ReturnService`](ReturnService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ReturnService`](ReturnService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
