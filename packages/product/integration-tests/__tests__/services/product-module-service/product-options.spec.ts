import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { IProductModuleService } from "@medusajs/types"
import { Product, ProductOption } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

describe("ProductModuleService product options", () => {
  let service: IProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let optionOne: ProductOption
  let optionTwo: ProductOption
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

    optionOne = testManager.create(ProductOption, {
      id: "option-1",
      title: "option 1",
      product: productOne,
    })

    optionTwo = testManager.create(ProductOption, {
      id: "option-2",
      title: "option 1",
      product: productTwo,
    })

    await testManager.persistAndFlush([optionOne, optionTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listOptions", () => {
    it("should return options and count queried by ID", async () => {
      const options = await service.listOptions({
        id: optionOne.id,
      })

      expect(options).toEqual([
        expect.objectContaining({
          id: optionOne.id,
        }),
      ])
    })

    it("should return options and count based on the options and filter parameter", async () => {
      let options = await service.listOptions(
        {
          id: optionOne.id,
        },
        {
          take: 1,
        }
      )

      expect(options).toEqual([
        expect.objectContaining({
          id: optionOne.id,
        }),
      ])

      options = await service.listOptions({}, { take: 1, skip: 1 })

      expect(options).toEqual([
        expect.objectContaining({
          id: optionTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for options", async () => {
      const options = await service.listOptions(
        {
          id: optionOne.id,
        },
        {
          select: ["title", "product.id"],
          relations: ["product"],
          take: 1
        }
      )

      expect(options).toEqual([
        {
          id: optionOne.id,
          title: optionOne.title,
          product_id: productOne.id,
          product: {
            id: productOne.id,
          },
        },
      ])
    })
  })

  describe("listAndCountOptions", () => {
    it("should return options and count queried by ID", async () => {
      const [options, count] = await service.listAndCountOptions({
        id: optionOne.id,
      })

      expect(count).toEqual(1)
      expect(options).toEqual([
        expect.objectContaining({
          id: optionOne.id,
        }),
      ])
    })

    it("should return options and count based on the options and filter parameter", async () => {
      let [options, count] = await service.listAndCountOptions(
        {
          id: optionOne.id,
        },
        {
          take: 1,
        }
      )

      expect(count).toEqual(1)
      expect(options).toEqual([
        expect.objectContaining({
          id: optionOne.id,
        }),
      ])

      ;[options, count] = await service.listAndCountOptions({}, { take: 1 })

      expect(count).toEqual(2)

      ;[options, count] = await service.listAndCountOptions({}, { take: 1, skip: 1 })

      expect(count).toEqual(2)
      expect(options).toEqual([
        expect.objectContaining({
          id: optionTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for options", async () => {
      const [options, count] = await service.listAndCountOptions(
        {
          id: optionOne.id,
        },
        {
          select: ["title", "product.id"],
          relations: ["product"],
          take: 1
        }
      )

      expect(count).toEqual(1)
      expect(options).toEqual([{
        id: optionOne.id,
        title: optionOne.title,
        product_id: productOne.id,
        product: {
          id: productOne.id,
        },
      }])
    })
  })

  describe("retrieveOption", () => {
    it("should return the requested option", async () => {
      const option = await service.retrieveOption(optionOne.id)

      expect(option).toEqual(
        expect.objectContaining({
          id: optionOne.id,
        }),
      )
    })

    it("should return requested attributes when requested through config", async () => {
      const option = await service.retrieveOption(
        optionOne.id,
        {
          select: ["id", "product.title"],
          relations: ["product"],
        }
      )

      expect(option).toEqual(
        expect.objectContaining({
          id: optionOne.id,
          product: {
            id: "product-1",
            title: "product 1",
          },
        }),
      )
    })

    it("should throw an error when a option with ID does not exist", async () => {
      let error

      try {
        await service.retrieveOption("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductOption with id: does-not-exist was not found")
    })
  })

  describe("deleteOptions", () => {
    const optionId = "option-1"

    it("should delete the product option given an ID successfully", async () => {
      await service.deleteOptions(
        [optionId],
      )

      const options = await service.listOptions({
        id: optionId
      })

      expect(options).toHaveLength(0)
    })
  })

  describe("updateOptions", () => {
    const optionId = "option-1"

    it("should update the title of the option successfully", async () => {
      await service.updateOptions(
        [{
          id: optionId,
          title: "new test"
        }]
      )

      const productOption = await service.retrieveOption(optionId)

      expect(productOption.title).toEqual("new test")
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.updateOptions([
          {
            id: "does-not-exist",
          }
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductOption with id "does-not-exist" not found')
    })
  })

  describe("createOptions", () => {
    it("should create a option successfully", async () => {
      const res = await service.createOptions([{
        title: "test",
        product_id: productOne.id
      }])

      const productOption = await service.listOptions({
        title: "test"
      })

      expect(productOption[0]?.title).toEqual("test")
    })
  })
})

