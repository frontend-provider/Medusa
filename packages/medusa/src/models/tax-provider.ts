import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class TaxProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}

/**
 * @schema TaxProvider
 * title: "Tax Provider"
 * description: "A tax provider represents a tax service installed in the Medusa backend, either through a plugin or backend customizations.
 *  It holds the tax service's installation status."
 * type: object
 * required:
 *   - id
 *   - is_installed
 * properties:
 *   id:
 *     description: The ID of the tax provider as given by the tax service.
 *     type: string
 *     example: manual
 *   is_installed:
 *     description: Whether the tax service is installed in the current version. If a tax service is no longer installed, the `is_installed` attribute is set to `false`.
 *     type: boolean
 *     default: true
 */
