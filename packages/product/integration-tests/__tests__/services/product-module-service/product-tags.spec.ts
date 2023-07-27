import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { IProductModuleService } from "@medusajs/types"
import { Product, ProductTag } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

describe("ProductModuleService product tags", () => {
  let service: IProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let tagOne: ProductTag
  let tagTwo: ProductTag
  let productOne: Product
  let productTwo: Product

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
      },
    })

    testManager = await TestDatabase.forkManager()
    productOne = testManager.create(Product, {
      id: "product-1",
      title: "product 1",
      status: ProductTypes.ProductStatus.PUBLISHED,
    })

    productTwo = testManager.create(Product, {
      id: "product-2",
      title: "product 2",
      status: ProductTypes.ProductStatus.PUBLISHED,
    })

    tagOne = testManager.create(ProductTag, {
      id: "tag-1",
      value: "tag 1",
      products: [productOne],
    })

    tagTwo = testManager.create(ProductTag, {
      id: "tag-2",
      value: "tag",
      products: [productTwo],
    })

    await testManager.persistAndFlush([tagOne, tagTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listTags", () => {
    it("should return tags and count queried by ID", async () => {
      const tags = await service.listTags({
        id: tagOne.id,
      })

      expect(tags).toEqual([
        expect.objectContaining({
          id: tagOne.id,
        }),
      ])
    })

    it("should return tags and count based on the options and filter parameter", async () => {
      let tags = await service.listTags(
        {
          id: tagOne.id,
        },
        {
          take: 1,
        }
      )

      expect(tags).toEqual([
        expect.objectContaining({
          id: tagOne.id,
        }),
      ])

      tags = await service.listTags({}, { take: 1, skip: 1 })

      expect(tags).toEqual([
        expect.objectContaining({
          id: tagTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for tags", async () => {
      const tags = await service.listTags(
        {
          id: tagOne.id,
        },
        {
          select: ["value", "products.id"],
          relations: ["products"],
          take: 1
        }
      )

      expect(tags).toEqual([
        {
          id: tagOne.id,
          value: tagOne.value,
          products: [{
            id: productOne.id,
          }],
        },
      ])
    })
  })

  describe("listAndCountTags", () => {
    it("should return tags and count queried by ID", async () => {
      const [tags, count] = await service.listAndCountTags({
        id: tagOne.id,
      })

      expect(count).toEqual(1)
      expect(tags).toEqual([
        expect.objectContaining({
          id: tagOne.id,
        }),
      ])
    })

    it("should return tags and count based on the options and filter parameter", async () => {
      let [tags, count] = await service.listAndCountTags(
        {
          id: tagOne.id,
        },
        {
          take: 1,
        }
      )

      expect(count).toEqual(1)
      expect(tags).toEqual([
        expect.objectContaining({
          id: tagOne.id,
        }),
      ])

      ;[tags, count] = await service.listAndCountTags({}, { take: 1 })

      expect(count).toEqual(2)

      ;[tags, count] = await service.listAndCountTags({}, { take: 1, skip: 1 })

      expect(count).toEqual(2)
      expect(tags).toEqual([
        expect.objectContaining({
          id: tagTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for tags", async () => {
      const [tags, count] = await service.listAndCountTags(
        {
          id: tagOne.id,
        },
        {
          select: ["value", "products.id"],
          relations: ["products"],
          take: 1
        }
      )

      expect(count).toEqual(1)
      expect(tags).toEqual([
        {
          id: tagOne.id,
          value: tagOne.value,
          products: [{
            id: productOne.id,
          }],
        },
      ])
    })
  })

  describe("retrieveTag", () => {
    it("should return the requested tag", async () => {
      const tag = await service.retrieveTag(tagOne.id)

      expect(tag).toEqual(
        expect.objectContaining({
          id: tagOne.id,
        }),
      )
    })

    it("should return requested attributes when requested through config", async () => {
      const tag = await service.retrieveTag(
        tagOne.id,
        {
          select: ["id", "value", "products.title"],
          relations: ["products"],
        }
      )

      expect(tag).toEqual(
        expect.objectContaining({
          id: tagOne.id,
          value: tagOne.value,
          products: [{
            id: "product-1",
            title: "product 1",
          }],
        }),
      )
    })

    it("should throw an error when a tag with ID does not exist", async () => {
      let error

      try {
        await service.retrieveTag("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductTag with id: does-not-exist was not found")
    })
  })

  describe("deleteTags", () => {
    const tagId = "tag-1"

    it("should delete the product tag given an ID successfully", async () => {
      await service.deleteTags(
        [tagId],
      )

      const tags = await service.listTags({
        id: tagId
      })

      expect(tags).toHaveLength(0)
    })
  })

  describe("updateTags", () => {
    const tagId = "tag-1"

    it("should update the value of the tag successfully", async () => {
      await service.updateTags(
        [{
          id: tagId,
          value: "UK"
        }]
      )

      const productTag = await service.retrieveTag(tagId)

      expect(productTag.value).toEqual("UK")
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.updateTags([
          {
            id: "does-not-exist",
            value: "UK"
          }
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductTag with id "does-not-exist" not found')
    })
  })

  describe("createTags", () => {
    it("should create a tag successfully", async () => {
      const res = await service.createTags(
        [{
          value: "UK"
        }]
      )

      const productTag = await service.listTags({
        value: "UK"
      })

      expect(productTag[0]?.value).toEqual("UK")
    })
  })
})

