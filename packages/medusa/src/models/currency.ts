import { Column, Entity, PrimaryColumn } from "typeorm"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

@Entity()
export class Currency {
  @PrimaryColumn()
  code: string

  @Column()
  symbol: string

  @Column()
  symbol_native: string

  @Column()
  name: string

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax?: boolean
}

/**
 * @schema currency
 * title: "Currency"
 * description: "Currency"
 * x-resourceId: currency
 * required:
 *   - code
 *   - symbol
 *   - symbol_native
 *   - name
 * properties:
 *  code:
 *    description: "The 3 character ISO code for the currency."
 *    type: string
 *    example: usd
 *    externalDocs:
 *      url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *      description: See a list of codes.
 *  symbol:
 *    description: "The symbol used to indicate the currency."
 *    type: string
 *    example: $
 *  symbol_native:
 *    description: "The native symbol used to indicate the currency."
 *    type: string
 *    example: $
 *  name:
 *    description: "The written name of the currency"
 *    type: string
 *    example: US Dollar
 *  includes_tax:
 *    description: "[EXPERIMENTAL] Does the currency prices include tax"
 *    type: boolean
 */
