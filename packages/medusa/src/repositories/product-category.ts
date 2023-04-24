import {
  Brackets,
  FindOptionsWhere,
  ILike,
  DeleteResult,
  In,
  FindOneOptions,
} from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, QuerySelector } from "../types/common"
import { dataSource } from "../loaders/database"
import { objectToStringPath } from "@medusajs/utils"
import { isEmpty } from "lodash"

export const ProductCategoryRepository = dataSource
  .getTreeRepository(ProductCategory)
  .extend({
    async findOneWithDescendants(
      query: FindOneOptions<ProductCategory>,
      treeScope: QuerySelector<ProductCategory> = {}
    ): Promise<ProductCategory | null> {
      const productCategory = await this.findOne(query)

      if (!productCategory) {
        return productCategory
      }

      return sortChildren(
        // Returns the productCategory with all of its descendants until the last child node
        await this.findDescendantsTree(productCategory),
        treeScope
      )
    },

    async getFreeTextSearchResultsAndCount(
      options: ExtendedFindConfig<ProductCategory> = {
        where: {},
      },
      q?: string,
      treeScope: QuerySelector<ProductCategory> = {},
      includeTree = false
    ): Promise<[ProductCategory[], number]> {
      const entityName = "product_category"
      const options_ = { ...options }
      options_.where = options_.where as FindOptionsWhere<ProductCategory>

      const columnsSelected = objectToStringPath(options_.select)
      const relationsSelected = objectToStringPath(options_.relations)

      const fetchSelectColumns = (relationName: string): string[] => {
        const modelColumns = this.metadata.ownColumns.map(
          (column) => column.propertyName
        )
        const selectColumns = columnsSelected.length
          ? columnsSelected
          : modelColumns

        return selectColumns.map((column) => {
          return `${relationName}.${column}`
        })
      }

      const queryBuilder = this.createQueryBuilder(entityName)
        .select(fetchSelectColumns(entityName))
        .skip(options_.skip)
        .take(options_.take)
        .addOrderBy(`${entityName}.rank`, "ASC")
        .addOrderBy(`${entityName}.handle`, "ASC")

      if (q) {
        delete options_.where?.name
        delete options_.where?.handle

        options_.where = [
          {
            ...options_.where,
            name: ILike(`%${q}%`),
          },
          {
            ...options_.where,
            handle: ILike(`%${q}%`),
          },
        ]
      }

      queryBuilder.where(options_.where)

      const includedTreeRelations: string[] = relationsSelected.filter((rel) =>
        ProductCategory.treeRelations.includes(rel)
      )

      includedTreeRelations.forEach((treeRelation) => {
        const treeWhere = Object.entries(treeScope)
          .map((entry) => `${treeRelation}.${entry[0]} = :${entry[0]}`)
          .join(" AND ")

        queryBuilder
          .leftJoin(
            `${entityName}.${treeRelation}`,
            treeRelation,
            treeWhere,
            treeScope
          )
          .addSelect(fetchSelectColumns(treeRelation))
      })

      const nonTreeRelations: string[] = relationsSelected.filter(
        (rel) => !ProductCategory.treeRelations.includes(rel)
      )

      nonTreeRelations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${entityName}.${relation}`, relation)
      })

      let [categories, count] = await queryBuilder.getManyAndCount()

      categories = await Promise.all(
        categories.map(async (productCategory) => {
          if (includeTree) {
            productCategory = await this.findDescendantsTree(productCategory)
          }

          return sortChildren(productCategory, treeScope)
        })
      )

      return [categories, count]
    },

    async addProducts(
      productCategoryId: string,
      productIds: string[]
    ): Promise<void> {
      const valuesToInsert = productIds.map((id) => ({
        product_category_id: productCategoryId,
        product_id: id,
      }))

      await this.createQueryBuilder()
        .insert()
        .into(ProductCategory.productCategoryProductJoinTable)
        .values(valuesToInsert)
        .orIgnore()
        .execute()
    },

    async removeProducts(
      productCategoryId: string,
      productIds: string[]
    ): Promise<DeleteResult> {
      return await this.createQueryBuilder()
        .delete()
        .from(ProductCategory.productCategoryProductJoinTable)
        .where({
          product_category_id: productCategoryId,
          product_id: In(productIds),
        })
        .execute()
    },
  })

export default ProductCategoryRepository

const scopeChildren = (
  category: ProductCategory,
  treeScope: QuerySelector<ProductCategory> = {}
): ProductCategory => {
  if (isEmpty(treeScope)) {
    return category
  }

  if (category.category_children) {
    category.category_children = category.category_children.filter(
      (categoryChild) => {
        return !Object.entries(treeScope).some(
          ([attribute, value]) => categoryChild[attribute] !== value
        )
      }
    )
  }

  return category
}

const sortChildren = (
  category: ProductCategory,
  treeScope: QuerySelector<ProductCategory> = {}
): ProductCategory => {
  if (category.category_children) {
    category.category_children = category.category_children
      .map(
        // Before we sort the children, we need scope the children
        // to conform to treeScope conditions
        (child) => sortChildren(scopeChildren(child, treeScope), treeScope)
      )
      .sort((a, b) => {
        // Sort by rank first
        const rankDiff = a.rank - b.rank

        // If the ranks are the same, sort by handle in ascending order
        if (rankDiff === 0) {
          return a.handle.localeCompare(b.handle)
        }

        return rankDiff
      })
  }

  return category
}
