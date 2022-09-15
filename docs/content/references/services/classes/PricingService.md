# Class: PricingService

Allows retrieval of prices.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PricingService`**

## Constructors

### constructor

• **new PricingService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/pricing.ts:45](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L45)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### featureFlagRouter

• `Protected` `Readonly` **featureFlagRouter**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/pricing.ts:43](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L43)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/pricing.ts:37](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L37)

___

### priceSelectionStrategy

• `Protected` `Readonly` **priceSelectionStrategy**: `IPriceSelectionStrategy`

#### Defined in

[packages/medusa/src/services/pricing.ts:41](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L41)

___

### productVariantService

• `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:42](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L42)

___

### regionService

• `Protected` `Readonly` **regionService**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:39](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L39)

___

### taxProviderService

• `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:40](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L40)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/pricing.ts:38](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L38)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### calculateTaxes

▸ **calculateTaxes**(`variantPricing`, `productRates`): `Promise`<`TaxedPricing`\>

Gets the prices for a product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantPricing` | `ProductVariantPricing` | the prices retrieved from a variant |
| `productRates` | `TaxServiceRate`[] | the tax rates that the product has applied |

#### Returns

`Promise`<`TaxedPricing`\>

The tax related variant prices.

#### Defined in

[packages/medusa/src/services/pricing.ts:105](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L105)

___

### collectPricingContext

▸ **collectPricingContext**(`context`): `Promise`<`PricingContext`\>

Collects additional information neccessary for completing the price
selection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricingContext`\>

The pricing context

#### Defined in

[packages/medusa/src/services/pricing.ts:70](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L70)

___

### getProductPricing

▸ **getProductPricing**(`product`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product. All the product's variants will
be fetched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `product` | `Pick`<`Product`, ``"id"`` \| ``"variants"``\> | the product to get pricing for. |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

A map of variant ids to their corresponding prices

#### Defined in

[packages/medusa/src/services/pricing.ts:324](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L324)

___

### getProductPricingById

▸ **getProductPricingById**(`productId`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product by the product id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get prices for |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

A map of variant ids to their corresponding prices

#### Defined in

[packages/medusa/src/services/pricing.ts:342](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L342)

___

### getProductPricing\_

▸ `Private` **getProductPricing_**(`productId`, `variants`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variants` | `ProductVariant`[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Defined in

[packages/medusa/src/services/pricing.ts:286](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L286)

___

### getProductVariantPricing

▸ **getProductVariantPricing**(`variant`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | `Pick`<`ProductVariant`, ``"id"`` \| ``"product_id"``\> | the id of the variant to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

The product variant prices

#### Defined in

[packages/medusa/src/services/pricing.ts:214](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L214)

___

### getProductVariantPricingById

▸ **getProductVariantPricingById**(`variantId`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant by a variant id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

The product variant prices

#### Defined in

[packages/medusa/src/services/pricing.ts:252](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L252)

___

### getProductVariantPricing\_

▸ `Private` **getProductVariantPricing_**(`variantId`, `taxRates`, `context`): `Promise`<`ProductVariantPricing`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantId` | `string` |
| `taxRates` | `TaxServiceRate`[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`ProductVariantPricing`\>

#### Defined in

[packages/medusa/src/services/pricing.ts:167](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L167)

___

### getShippingOptionPricing

▸ **getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<`PricedShippingOption`\>

Gets the prices for a shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOption` | `ShippingOption` | the shipping option to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`\>

The shipping option prices

#### Defined in

[packages/medusa/src/services/pricing.ts:428](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L428)

___

### setProductPrices

▸ **setProductPrices**(`products`, `context?`): `Promise`<(`Product` \| `PricedProduct`)[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `products` | `Product`[] | list of products on which to set additional prices |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

A list of products with variants decorated with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:385](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L385)

___

### setShippingOptionPrices

▸ **setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<`PricedShippingOption`[]\>

Set additional prices on a list of shipping options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOptions` | `ShippingOption`[] | list of shipping options on which to set additional prices |
| `context` | `Omit`<`PriceSelectionContext`, ``"region_id"``\> | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`[]\>

A list of shipping options with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:490](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L490)

___

### setVariantPrices

▸ **setVariantPrices**(`variants`, `context`): `Promise`<`PricedVariant`[]\>

Set additional prices on a list of product variants.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variants` | `ProductVariant`[] | list of variants on which to set additional prices |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricedVariant`[]\>

A list of products with variants decorated with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:360](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/pricing.ts#L360)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PricingService`](PricingService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PricingService`](PricingService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
