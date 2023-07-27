import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductOptionService } from "@services"
import { ProductOptionRepository } from "@repositories"
import { Product } from "@models"

import { TestDatabase } from "../../../utils"
import { createOptions } from "../../../__fixtures__/product"
import { ProductTypes } from "@medusajs/types"

jest.setTimeout(30000)

describe("ProductOption Service", () => {
  let service: ProductOptionService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let productOne: Product
  let productTwo: Product
  let data!: Product[]

  const productOneData = {
    id: "product-1",
    title: "product 1",
    status: ProductTypes.ProductStatus.PUBLISHED,
  }

  const productTwoData = {
    id: "product-2",
    title: "product 2",
    status: ProductTypes.ProductStatus.PUBLISHED,
  }

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productOptionRepository = new ProductOptionRepository({
      manager: repositoryManager,
    })

    service = new ProductOptionService({
      productOptionRepository,
    })

    testManager = await TestDatabase.forkManager()
    productOne = testManager.create(Product, productOneData)
    productTwo = testManager.create(Product, productTwoData)

    data = await createOptions(testManager, [
      {
        id: "option-1",
        title: "Option 1",
        product: productOne,
      },
      {
        id: "option-2",
        title: "Option 2",
        product: productOne,
      },
    ])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    it("list product option", async () => {
      const optionResults = await service.list()

      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-1",
          title: "Option 1",
        }),
        expect.objectContaining({
          id: "option-2",
          title: "Option 2",
        }),
      ])
    })

    it("list product option by id", async () => {
      const optionResults = await service.list({ id: "option-2" })

      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-2",
          title: "Option 2",
        }),
      ])
    })

    it("list product option by title matching string", async () => {
      const optionResults = await service.list({ title: "Option 1" })

      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-1",
          title: "Option 1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return product option and count", async () => {
      const [optionResults, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-1",
          title: "Option 1",
        }),
        expect.objectContaining({
          id: "option-2",
          title: "Option 2",
        }),
      ])
    })

    it("should return product option and count when filtered", async () => {
      const [optionResults, count] = await service.listAndCount({ id: "option-2" })

      expect(count).toEqual(1)
      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-2",
        }),
      ])
    })

    it("should return product option and count when using skip and take", async () => {
      const [optionResults, count] = await service.listAndCount({}, { skip: 1, take: 1 })

      expect(count).toEqual(2)
      expect(optionResults).toEqual([
        expect.objectContaining({
          id: "option-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [optionResults, count] = await service.listAndCount({}, {
        take: 1,
        select: ["title"],
      })

      const serialized = JSON.parse(JSON.stringify(optionResults))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        expect.objectContaining({
          id: "option-1",
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const optionId = "option-1"
    const optionValue = "Option 1"

    it("should return option for the given id", async () => {
      const option = await service.retrieve(
        optionId,
      )

      expect(option).toEqual(
        expect.objectContaining({
          id: optionId
        })
      )
    })

    it("should throw an error when option with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductOption with id: does-not-exist was not found')
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"productOptionId" must be defined')
    })

    it("should return option based on config select param", async () => {
      const option = await service.retrieve(
        optionId,
        {
          select: ["id", "title"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(option))

      expect(serialized).toEqual(
        {
          id: optionId,
          title: optionValue,
        }
      )
    })
  })

  describe("delete", () => {
    const optionId = "option-1"

    it("should delete the product option given an ID successfully", async () => {

      await service.delete(
        [optionId],
      )

      const options = await service.list({
        id: optionId
      })

      expect(options).toHaveLength(0)
    })
  })

  describe("update", () => {
    const optionId = "option-1"

    it("should update the title of the option successfully", async () => {
      await service.update(
        [{
          id: optionId,
          title: "UK",
        }]
      )

      const productOption = await service.retrieve(optionId)

      expect(productOption.title).toEqual("UK")
    })

    it("should update the relationship of the option successfully", async () => {
      await service.update(
        [{
          id: optionId,
          product_id: productTwo.id,
        }]
      )

      const productOption = await service.retrieve(optionId, {
        relations: ["product"]
      })

      expect(productOption).toEqual(
        expect.objectContaining({
          id: optionId,
          product: expect.objectContaining({
            id: productTwo.id
          })
        })
      )
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.update([
        {
          id: "does-not-exist",
          title: "UK",
        }
      ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductOption with id "does-not-exist" not found')
    })
  })

  describe("create", () => {
    it("should create a option successfully", async () => {
      await service.create(
        [{
          title: "UK",
          product: productOne
        }]
      )

      const [productOption] = await service.list({
        title: "UK"
      }, {
        relations: ["product"],
      })


      expect(productOption).toEqual(
        expect.objectContaining({
          title: "UK",
          product: expect.objectContaining({
            id: productOne.id
          })
        })
      )
    })
  })
})
