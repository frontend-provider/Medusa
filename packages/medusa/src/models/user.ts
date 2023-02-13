import { BeforeInsert, Column, Entity, Index } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

@Entity()
export class User extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: UserRoles,
    nullable: true,
    default: UserRoles.MEMBER,
  })
  role: UserRoles

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true, select: false })
  password_hash: string

  @Column({ nullable: true })
  api_token: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "usr")
  }
}

/**
 * @schema User
 * title: "User"
 * description: "Represents a User who can manage store settings."
 * type: object
 * required:
 *   - api_token
 *   - created_at
 *   - deleted_at
 *   - email
 *   - first_name
 *   - id
 *   - last_name
 *   - metadata
 *   - role
 *   - updated_at
 * properties:
 *   id:
 *     description: The user's ID
 *     type: string
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   role:
 *     description: The user's role
 *     type: string
 *     enum:
 *       - admin
 *       - member
 *       - developer
 *     default: member
 *   email:
 *     description: The email of the User
 *     type: string
 *     format: email
 *   first_name:
 *     description: The first name of the User
 *     nullable: true
 *     type: string
 *     example: Levi
 *   last_name:
 *     description: The last name of the User
 *     nullable: true
 *     type: string
 *     example: Bogan
 *   api_token:
 *     description: An API token associated with the user.
 *     nullable: true
 *     type: string
 *     example: null
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
