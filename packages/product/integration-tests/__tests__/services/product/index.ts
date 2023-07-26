import { Image, Product, ProductCategory, ProductVariant } from "@models"
import {
  assignCategoriesToProduct,
  createImages,
  createProductAndTags,
  createProductVariants,
} from "../../../__fixtures__/product"
import {
  categoriesData,
  productsData,
  variantsData,
} from "../../../__fixtures__/product/data"

import { ProductDTO, ProductTypes } from "@medusajs/types"
import { ProductRepository } from "@repositories"
import { ProductService } from "@services"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { TestDatabase } from "../../../utils"
import { buildProductOnlyData } from "../../../__fixtures__/product/data/create-product"
import { createProductCategories } from "../../../__fixtures__/product-category"
import { kebabCase } from "@medusajs/utils"

jest.setTimeout(30000)

describe("Product Service", () => {
  let service: ProductService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let products!: Product[]
  let productOne: Product
  let variants!: ProductVariant[]
  let categories!: ProductCategory[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productRepository = new ProductRepository({
      manager: repositoryManager,
    })

    service = new ProductService({
      productRepository,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("retrieve", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()
      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      await testManager.persistAndFlush([productOne])
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"productId" must be defined')
    })

    it("should throw an error when product with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('Product with id: does-not-exist was not found')
    })

    it("should return a product when product with an id exists", async () => {
      const result = await service.retrieve(productOne.id)

      expect(result).toEqual(expect.objectContaining({
        id: productOne.id
      }))
    })
  })

  describe("create", function () {
    let images: Image[] = []

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      images = await createImages(testManager, ["image-1"])
    })

    it("should create a product", async () => {
      const data = buildProductOnlyData({
        images,
        thumbnail: images[0].url,
      })

      const products = await service.create([data])

      expect(products).toHaveLength(1)
      expect(JSON.parse(JSON.stringify(products[0]))).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: data.title,
          handle: kebabCase(data.title),
          description: data.description,
          subtitle: data.subtitle,
          is_giftcard: data.is_giftcard,
          discountable: data.discountable,
          thumbnail: images[0].url,
          status: data.status,
          images: expect.arrayContaining([
            expect.objectContaining({
              id: images[0].id,
              url: images[0].url,
            }),
          ]),
        })
      )
    })
  })

  describe("update", function () {
    let images: Image[] = []

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()
      images = await createImages(testManager, ["image-1", "image-2"])

      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      await testManager.persistAndFlush([productOne])
    })

    it("should update a product and its allowed relations", async () => {
      const updateData = [{
        id: productOne.id,
        title: "update test 1",
        images: images,
        thumbnail: images[0].url,
      }]

      const products = await service.update(updateData)

      expect(products.length).toEqual(1)

      let result = await service.retrieve(productOne.id, {relations: ["images", "thumbnail"]})
      let serialized = JSON.parse(JSON.stringify(result))

      expect(serialized).toEqual(
        expect.objectContaining({
          id: productOne.id,
          title: "update test 1",
          thumbnail: images[0].url,
          images: [
            expect.objectContaining({
              url: images[0].url,
            }),
            expect.objectContaining({
              url: images[1].url,
            }),
          ],
        })
      )
    })

    it("should throw an error when id is not present", async () => {
      let error
      const updateData = [{
        id: productOne.id,
        title: "update test 1",
      }, {
        id: undefined as unknown as string,
        title: "update test 2",
      }]

      try {
        await service.update(updateData)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(`Product with id "undefined" not found`)

      let result = await service.retrieve(productOne.id)

      expect(result.title).not.toBe("update test 1")
    })

    it("should throw an error when product with id does not exist", async () => {
      let error
      const updateData = [{
        id: "does-not-exist",
        title: "update test 1",
      }]

      try {
        await service.update(updateData)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(`Product with id "does-not-exist" not found`)
    })
  })

  describe("list", () => {
    describe("soft deleted", function () {
      let deletedProduct
      let product

      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        const products = await createProductAndTags(testManager, productsData)

        product = products[1]
        deletedProduct = await service.softDelete([products[0].id])
      })

      it("should list all products that are not deleted", async () => {
        const products = await service.list()

        expect(products).toHaveLength(1)
        expect(products[0].id).toEqual(product.id)
      })

      it("should list all products including the deleted", async () => {
        const products = await service.list({}, { withDeleted: true })

        expect(products).toHaveLength(2)
      })
    })

    describe("relation: tags", () => {
      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
      })

      it("should filter by id and including relations", async () => {
        const productsResult = await service.list(
          {
            id: products[0].id,
          },
          {
            relations: ["tags"],
          }
        )

        productsResult.forEach((product, index) => {
          const tags = product.tags.toArray()

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          tags.forEach((tag, tagIndex) => {
            expect(tag).toEqual(
              expect.objectContaining({
                ...productsData[index].tags[tagIndex],
              })
            )
          })
        })
      })

      it("should filter by id and without relations", async () => {
        const productsResult = await service.list({
          id: products[0].id,
        })

        productsResult.forEach((product, index) => {
          const tags = product.tags.getItems(false)

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          expect(tags.length).toBe(0)
        })
      })
    })

    describe("relation: categories", () => {
      let workingProduct: Product
      let workingCategory: ProductCategory

      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
        workingProduct = products.find((p) => p.id === "test-1") as Product
        categories = await createProductCategories(testManager, categoriesData)
        workingCategory = (await testManager.findOne(
          ProductCategory,
          "category-1"
        )) as ProductCategory

        workingProduct = await assignCategoriesToProduct(
          testManager,
          workingProduct,
          categories
        )
      })

      it("should filter by categories relation and scope fields", async () => {
        const products = await service.list(
          {
            id: workingProduct.id,
            categories: { id: [workingCategory.id] },
          },
          {
            select: [
              "title",
              "categories.name",
              "categories.handle",
              "categories.mpath",
            ] as (keyof ProductDTO)[],
            relations: ["categories"],
          }
        )

        const product = products.find(
          (p) => p.id === workingProduct.id
        ) as unknown as Product

        expect(product).toEqual(
          expect.objectContaining({
            id: workingProduct.id,
            title: workingProduct.title,
          })
        )

        expect(product.categories.toArray()).toEqual([
          {
            id: "category-0",
            name: "category 0",
            handle: "category-0",
            mpath: "category-0.",
          },
          {
            id: "category-1",
            name: "category 1",
            handle: "category-1",
            mpath: "category-0.category-1.",
          },
          {
            id: "category-1-a",
            name: "category 1 a",
            handle: "category-1-a",
            mpath: "category-0.category-1.category-1-a.",
          },
        ])
      })

      it("should returns empty array when querying for a category that doesnt exist", async () => {
        const products = await service.list(
          {
            id: workingProduct.id,
            categories: { id: ["category-doesnt-exist-id"] },
          },
          {
            select: [
              "title",
              "categories.name",
              "categories.handle",
            ] as (keyof ProductDTO)[],
            relations: ["categories"],
          }
        )

        expect(products).toEqual([])
      })
    })

    describe("relation: variants", () => {
      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
        variants = await createProductVariants(testManager, variantsData)
      })

      it("should filter by id and including relations", async () => {
        const productsResult = await service.list(
          {
            id: products[0].id,
          },
          {
            relations: ["variants"],
          }
        )

        productsResult.forEach((product, index) => {
          const variants = product.variants.toArray()

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          variants.forEach((variant, variantIndex) => {
            const expectedVariant = variantsData.filter(
              (d) => d.product.id === product.id
            )[variantIndex]

            const variantProduct = variant.product

            expect(variant).toEqual(
              expect.objectContaining({
                id: expectedVariant.id,
                sku: expectedVariant.sku,
                title: expectedVariant.title,
              })
            )
          })
        })
      })
    })
  })

  describe("softDelete", function () {
    let images: Image[] = []

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      images = await createImages(testManager, ["image-1"])
    })

    it("should soft delete a product", async () => {
      const data = buildProductOnlyData({
        images,
        thumbnail: images[0].url,
      })

      const products = await service.create([data])
      const deleteProducts = await service.softDelete(products.map((p) => p.id))

      expect(deleteProducts).toHaveLength(1)
      expect(deleteProducts[0].deleted_at).not.toBeNull()
    })
  })

  describe("restore", function () {
    let images: Image[] = []

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      images = await createImages(testManager, ["image-1"])
    })

    it("should restore a soft deleted product", async () => {
      const data = buildProductOnlyData({
        images,
        thumbnail: images[0].url,
      })

      const products = await service.create([data])
      const product = products[0]
      await service.softDelete([product.id])
      const restoreProducts = await service.restore([product.id])

      expect(restoreProducts).toHaveLength(1)
      expect(restoreProducts[0].deleted_at).toBeNull()
    })
  })
})
