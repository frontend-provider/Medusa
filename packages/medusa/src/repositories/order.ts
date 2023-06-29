import { objectToStringPath } from "@medusajs/utils"
import { flatten } from "lodash"
import { FindManyOptions, FindOptionsRelations, In } from "typeorm"
import { dataSource } from "../loaders/database"
import { Order } from "../models"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
} from "../utils/repository"

const ITEMS_REL_NAME = "items"
const REGION_REL_NAME = "region"

export const OrderRepository = dataSource.getRepository(Order).extend({
  async findWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations = getGroupedRelations(objectToStringPath(relations))

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([topLevel, rels]) => {
        // If top level is region or items then get deleted region as well
        return this.find({
          where: { id: In(entitiesIds) },
          select: ["id"],
          relations: rels,
          withDeleted:
            topLevel === ITEMS_REL_NAME || topLevel === REGION_REL_NAME,
          relationLoadStrategy: "join",
        })
      })
    ).then(flatten)

    const entitiesAndRelations = entities.concat(entitiesIdsWithRelations)
    return mergeEntitiesWithRelations<Order>(entitiesAndRelations)
  },

  async findOneWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  },
})

export default OrderRepository
