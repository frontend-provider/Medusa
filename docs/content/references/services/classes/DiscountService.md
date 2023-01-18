# Class: DiscountService

Provides layer to manipulate discounts.

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`DiscountService`**

## Constructors

### constructor

• **new DiscountService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/discount.ts:68](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L68)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:55](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L55)

___

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: typeof `DiscountConditionRepository`

#### Defined in

[packages/medusa/src/services/discount.ts:59](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L59)

___

### discountConditionService\_

• `Protected` `Readonly` **discountConditionService\_**: [`DiscountConditionService`](DiscountConditionService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:60](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L60)

___

### discountRepository\_

• `Protected` `Readonly` **discountRepository\_**: typeof `DiscountRepository`

#### Defined in

[packages/medusa/src/services/discount.ts:54](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L54)

___

### discountRuleRepository\_

• `Protected` `Readonly` **discountRuleRepository\_**: typeof `DiscountRuleRepository`

#### Defined in

[packages/medusa/src/services/discount.ts:56](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L56)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:65](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L65)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/discount.ts:66](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L66)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[packages/medusa/src/services/discount.ts:57](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L57)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/discount.ts:51](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L51)

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:62](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L62)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:63](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L63)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:64](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L64)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:61](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L61)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/discount.ts:52](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L52)

## Methods

### addRegion

▸ **addRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

Adds a region to the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to add |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/discount.ts:487](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L487)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### calculateDiscountForLineItem

▸ **calculateDiscountForLineItem**(`discountId`, `lineItem`, `calculationContextData`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `lineItem` | `LineItem` |
| `calculationContextData` | `CalculationContextData` |

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/medusa/src/services/discount.ts:588](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L588)

___

### canApplyForCustomer

▸ **canApplyForCustomer**(`discountRuleId`, `customerId`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountRuleId` | `string` |
| `customerId` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/discount.ts:762](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L762)

___

### create

▸ **create**(`discount`): `Promise`<`Discount`\>

Creates a discount with provided data given that the data is validated.
Normalizes discount code to uppercase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | `CreateDiscountInput` | the discount data to create |

#### Returns

`Promise`<`Discount`\>

the result of the create operation

#### Defined in

[packages/medusa/src/services/discount.ts:186](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L186)

___

### createDynamicCode

▸ **createDynamicCode**(`discountId`, `data`): `Promise`<`Discount`\>

Creates a dynamic code for a discount id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `data` | `CreateDynamicDiscountInput` | the object containing a code to identify the discount by |

#### Returns

`Promise`<`Discount`\>

the newly created dynamic code

#### Defined in

[packages/medusa/src/services/discount.ts:415](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L415)

___

### delete

▸ **delete**(`discountId`): `Promise`<`void`\>

Deletes a discount idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount to delete |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/discount.ts:547](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L547)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`discountId`, `code`): `Promise`<`void`\>

Deletes a dynamic code for a discount id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `code` | `string` | the code to identify the discount by |

#### Returns

`Promise`<`void`\>

the newly created dynamic code

#### Defined in

[packages/medusa/src/services/discount.ts:466](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L466)

___

### hasExpired

▸ **hasExpired**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/discount.ts:731](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L731)

___

### hasNotStarted

▸ **hasNotStarted**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/discount.ts:727](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L727)

___

### hasReachedLimit

▸ **hasReachedLimit**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/discount.ts:721](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L721)

___

### isDisabled

▸ **isDisabled**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/discount.ts:739](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L739)

___

### isValidForRegion

▸ **isValidForRegion**(`discount`, `region_id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |
| `region_id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/discount.ts:743](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L743)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Discount`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` | the query object for find |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/discount.ts:124](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L124)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`Discount`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` | the query object for find |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`[], `number`]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/discount.ts:140](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L140)

___

### removeRegion

▸ **removeRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

Removes a region from the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to remove |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/discount.ts:522](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L522)

___

### retrieve

▸ **retrieve**(`discountId`, `config?`): `Promise`<`Discount`\>

Gets a discount by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`\>

the discount

#### Defined in

[packages/medusa/src/services/discount.ts:252](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L252)

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `config?`): `Promise`<`Discount`\>

Gets a discount by discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCode` | `string` | discount code of discount to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`\>

the discount document

#### Defined in

[packages/medusa/src/services/discount.ts:285](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L285)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### update

▸ **update**(`discountId`, `update`): `Promise`<`Discount`\>

Updates a discount.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | discount id of discount to update |
| `update` | `UpdateDiscountInput` | the data to update the discount with |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/discount.ts:318](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L318)

___

### validateDiscountForCartOrThrow

▸ **validateDiscountForCartOrThrow**(`cart`, `discount`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `discount` | `Discount` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/discount.ts:661](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L661)

___

### validateDiscountForProduct

▸ **validateDiscountForProduct**(`discountRuleId`, `productId`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountRuleId` | `string` |
| `productId` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/discount.ts:561](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L561)

___

### validateDiscountRule\_

▸ **validateDiscountRule_**<`T`\>(`discountRule`): `T`

Creates a discount rule with provided data given that the data is validated.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountRule` | `T` | the discount rule to create |

#### Returns

`T`

the result of the create operation

#### Defined in

[packages/medusa/src/services/discount.ts:106](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/discount.ts#L106)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DiscountService`](DiscountService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DiscountService`](DiscountService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
