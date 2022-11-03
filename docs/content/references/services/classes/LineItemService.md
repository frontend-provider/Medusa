# Class: LineItemService

## Hierarchy

- `TransactionBaseService`

  ↳ **`LineItemService`**

## Constructors

### constructor

• **new LineItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/line-item.ts:53](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L53)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:44](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L44)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/line-item.ts:49](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L49)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:43](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L43)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L50)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:42](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L42)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/line-item.ts:39](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L39)

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L47)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:46](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L46)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:45](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L45)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:48](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L48)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:51](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L51)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/line-item.ts:40](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L40)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### cloneTo

▸ **cloneTo**(`ids`, `data?`, `options?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string` \| `string`[] |
| `data` | `Object` |
| `data.adjustments?` | (`undefined` \| { id?: string \| undefined; item\_id?: string \| undefined; item?: { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; ... 37 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 38 more ...; updated\_at?: { ...; }...)[] |
| `data.allow_discounts?` | `boolean` |
| `data.cart?` | { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; customer?: { ...; } \| ... 1 more ... \| undefined; ... 15 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: ... |
| `data.cart_id?` | `string` |
| `data.claim_order?` | { payment\_status?: ClaimPaymentStatus \| undefined; fulfillment\_status?: ClaimFulfillmentStatus \| undefined; claim\_items?: ({ images?: ({ ...; } \| undefined)[] \| undefined; ... 14 more ...; updated\_at?: { ...; } \| undefined; } \| undefined)[] \| undefined; ... 17 more ...; id?: string \| undefined; } |
| `data.claim_order_id?` | `string` |
| `data.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.description?` | `string` |
| `data.discount_total?` | ``null`` \| `number` |
| `data.fulfilled_quantity?` | `number` |
| `data.gift_card_total?` | ``null`` \| `number` |
| `data.has_shipping?` | `boolean` |
| `data.id?` | `string` |
| `data.includes_tax?` | `boolean` |
| `data.is_giftcard?` | `boolean` |
| `data.is_return?` | `boolean` |
| `data.metadata?` | { [x: string]: unknown; } |
| `data.order?` | { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; payment\_status?: PaymentStatus \| undefined; ... 48 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.order_edit?` | ``null`` \| { order\_id?: string \| undefined; order?: { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; ... 49 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 27 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.order_edit_id?` | ``null`` \| `string` |
| `data.order_id?` | ``null`` \| `string` |
| `data.original_item_id?` | ``null`` \| `string` |
| `data.original_tax_total?` | ``null`` \| `number` |
| `data.original_total?` | ``null`` \| `number` |
| `data.quantity?` | `number` |
| `data.refundable?` | ``null`` \| `number` |
| `data.returned_quantity?` | `number` |
| `data.shipped_quantity?` | `number` |
| `data.should_merge?` | `boolean` |
| `data.subtotal?` | ``null`` \| `number` |
| `data.swap?` | { fulfillment\_status?: SwapFulfillmentStatus \| undefined; payment\_status?: SwapPaymentStatus \| undefined; order\_id?: string \| undefined; ... 20 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.swap_id?` | `string` |
| `data.tax_lines?` | (`undefined` \| { item\_id?: string \| undefined; item?: { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; ... 37 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 38 more ...; updated\_at?: { ...; } \| undefined; } \| undefin...)[] |
| `data.tax_total?` | ``null`` \| `number` |
| `data.thumbnail?` | ``null`` \| `string` |
| `data.title?` | `string` |
| `data.total?` | ``null`` \| `number` |
| `data.unit_price?` | `number` |
| `data.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.variant?` | { title?: string \| undefined; product\_id?: string \| undefined; product?: { title?: string \| undefined; subtitle?: string \| null \| undefined; description?: string \| null \| undefined; ... 29 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 22 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.variant_id?` | `string` |
| `options` | `Object` |
| `options.setOriginalLineItemId?` | `boolean` |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[packages/medusa/src/services/line-item.ts:394](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L394)

___

### create

▸ **create**(`data`): `Promise`<`LineItem`\>

Create a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`LineItem`\> | the line item object to create |

#### Returns

`Promise`<`LineItem`\>

the created line item

#### Defined in

[packages/medusa/src/services/line-item.ts:278](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L278)

___

### createReturnLines

▸ **createReturnLines**(`returnId`, `cartId`): `Promise`<`LineItem`[]\>

Creates return line items for a given cart based on the return items in a
return.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id to generate return items from. |
| `cartId` | `string` | the cart to assign the return line items to. |

#### Returns

`Promise`<`LineItem`[]\>

the created line items

#### Defined in

[packages/medusa/src/services/line-item.ts:128](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L128)

___

### createTaxLine

▸ **createTaxLine**(`args`): `LineItemTaxLine`

Create a line item tax line.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | tax line partial passed to the repo create method |
| `args.code?` | ``null`` \| `string` | - |
| `args.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `args.id?` | `string` | - |
| `args.item?` | { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: {... | - |
| `args.item_id?` | `string` | - |
| `args.metadata?` | { [x: string]: unknown; } | - |
| `args.name?` | `string` | - |
| `args.rate?` | `number` | - |
| `args.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`LineItemTaxLine`

a new line item tax line

#### Defined in

[packages/medusa/src/services/line-item.ts:386](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L386)

___

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| `LineItem`\>

Deletes a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item.ts:346](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L346)

___

### deleteWithTaxLines

▸ **deleteWithTaxLines**(`id`): `Promise`<`undefined` \| `LineItem`\>

Deletes a line item with the tax lines.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item.ts:365](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L365)

___

### generate

▸ **generate**(`variantId`, `regionId`, `quantity`, `context?`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantId` | `string` |
| `regionId` | `string` |
| `quantity` | `number` |
| `context` | `Object` |
| `context.cart?` | `Cart` |
| `context.customer_id?` | `string` |
| `context.includes_tax?` | `boolean` |
| `context.metadata?` | `Record`<`string`, `unknown`\> |
| `context.order_edit_id?` | `string` |
| `context.unit_price?` | `number` |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[packages/medusa/src/services/line-item.ts:181](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L181)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`LineItem`\> |
| `config` | `FindConfig`<`LineItem`\> |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[packages/medusa/src/services/line-item.ts:81](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L81)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`LineItem`\>

Retrieves a line item by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to retrieve |
| `config` | `Object` | the config to be used at query building |

#### Returns

`Promise`<`LineItem`\>

the line item

#### Defined in

[packages/medusa/src/services/line-item.ts:101](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L101)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`idOrSelector`, `data`): `Promise`<`LineItem`[]\>

Updates a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idOrSelector` | `string` \| `Selector`<`LineItem`\> | the id or selector of the line item(s) to update |
| `data` | `Partial`<`LineItem`\> | the properties to update the line item(s) |

#### Returns

`Promise`<`LineItem`[]\>

the updated line item(s)

#### Defined in

[packages/medusa/src/services/line-item.ts:297](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/line-item.ts#L297)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`LineItemService`](LineItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemService`](LineItemService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
