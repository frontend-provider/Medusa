import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"

import { Region } from "./region"

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  iso_2: string

  @Column()
  iso_3: string

  @Column()
  num_code: number

  @Column()
  name: string

  @Column()
  display_name: string

  @Index()
  @Column({ nullable: true })
  region_id: string | null

  @ManyToOne(() => Region, (r) => r.countries)
  @JoinColumn({ name: "region_id" })
  region: Region
}

/**
 * @schema country
 * title: "Country"
 * description: "Country details"
 * x-resourceId: country
 * required:
 *   - iso_2
 *   - iso_3
 *   - num_code
 *   - name
 *   - display_name
 * properties:
 *   id:
 *     type: string
 *     description: The country's ID
 *     example: 109
 *   iso_2:
 *     type: string
 *     description: The 2 character ISO code of the country in lower case
 *     example: it
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *       description: See a list of codes.
 *   iso_3:
 *     type: string
 *     description: The 2 character ISO code of the country in lower case
 *     example: ita
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3#Officially_assigned_code_elements
 *       description: See a list of codes.
 *   num_code:
 *     description: "The numerical ISO code for the country."
 *     type: string
 *     example: 380
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_numeric#Officially_assigned_code_elements
 *       description: See a list of codes.
 *   name:
 *     description: "The normalized country name in upper case."
 *     type: string
 *     example: ITALY
 *   display_name:
 *     description: "The country name appropriate for display."
 *     type: string
 *     example: Italy
 *   region_id:
 *     type: string
 *     description: The region ID this country is associated with.
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     type: object
 */
