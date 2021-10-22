const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")
const { ProductVariant } = require("@medusajs/medusa")

jest.setTimeout(50000)

describe("/admin/products", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/products", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of products with all statuses when no status or invalid status is provided", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "draft",
          }),
          expect.objectContaining({
            id: "test-product1",
            status: "draft",
          }),
        ])
      )
    })

    it("returns a list of all products when no query is provided", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products?q=", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "draft",
          }),
          expect.objectContaining({
            id: "test-product1",
            status: "draft",
          }),
        ])
      )
    })

    it("returns a list of products where status is proposed", async () => {
      const api = useApi()

      const payload = {
        status: "proposed",
      }

      // update test-product status to proposed
      await api
        .post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/products?status[]=proposed", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "proposed",
          }),
        ])
      )
    })

    it("returns a list of products where status is proposed or published", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ status: "draft" }),
        expect.objectContaining({ status: "rejected" }),
      ]

      const response = await api
        .get("/admin/products?status[]=published,proposed", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: "test-product_filtering_1",
          status: "proposed",
        }),
        expect.objectContaining({
          id: "test-product_filtering_2",
          status: "published",
        }),
      ])

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of products in collection", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ collection_id: "test-collection" }),
        expect.objectContaining({ collection_id: "test-collection2" }),
      ]

      const response = await api
        .get("/admin/products?collection_id[]=test-collection1", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: "test-product_filtering_1",
          collection_id: "test-collection1",
        }),
        expect.objectContaining({
          id: "test-product_filtering_3",
          collection_id: "test-collection1",
        }),
      ])

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of products with tags", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ id: "tag1" }),
        expect.objectContaining({ id: "tag2" }),
        expect.objectContaining({ id: "tag4" }),
      ]

      const response = await api
        .get("/admin/products?tags[]=tag3", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: "test-product_filtering_1",
          tags: [expect.objectContaining({ id: "tag3" })],
        }),
        expect.objectContaining({
          id: "test-product_filtering_2",
          tags: [expect.objectContaining({ id: "tag3" })],
        }),
      ])
      for (const product of response.data.products) {
        for (const notExpect of notExpected) {
          expect(product.tags).toEqual(expect.not.arrayContaining([notExpect]))
        }
      }
    })

    it("returns a list of products with tags in a collection", async () => {
      const api = useApi()

      const notExpectedTags = [
        expect.objectContaining({ id: "tag1" }),
        expect.objectContaining({ id: "tag2" }),
        expect.objectContaining({ id: "tag3" }),
      ]

      const notExpectedCollections = [
        expect.objectContaining({ collection_id: "test-collection" }),
        expect.objectContaining({ collection_id: "test-collection2" }),
      ]

      const response = await api
        .get("/admin/products?collection_id[]=test-collection1&tags[]=tag4", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: "test-product_filtering_3",
          collection_id: "test-collection1",
          tags: [expect.objectContaining({ id: "tag4" })],
        }),
      ])

      for (const notExpect of notExpectedCollections) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }

      for (const product of response.data.products) {
        for (const notExpect of notExpectedTags) {
          expect(product.tags).toEqual(expect.not.arrayContaining([notExpect]))
        }
      }
    })

    it("returns a list of products with giftcard in list", async () => {
      const api = useApi()

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      await api
        .post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/products?is_giftcard=true", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.products).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ is_giftcard: false }),
        ])
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toMatchSnapshot([
        {
          title: "Test Giftcard",
          id: expect.stringMatching(/^prod_*/),
          is_giftcard: true,
          description: "test-giftcard-description",
          profile_id: expect.stringMatching(/^sp_*/),
          options: [
            {
              title: "Denominations",
              id: expect.stringMatching(/^opt_*/),
              product_id: expect.stringMatching(/^prod_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],

          variants: [
            {
              title: "Test variant",
              id: expect.stringMatching(/^variant_*/),
              product_id: expect.stringMatching(/^prod_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              prices: [
                {
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 100,
                  variant_id: expect.stringMatching(/^variant_*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^opt_*/),
                  option_id: expect.stringMatching(/^opt_*/),
                  created_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                  updated_at: expect.any(String),
                },
              ],
            },
          ],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })

    it("returns a list of products with child entities", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.products).toMatchSnapshot([
        {
          id: expect.stringMatching(/^test-*/),
          created_at: expect.any(String),
          options: [
            {
              id: expect.stringMatching(/^test-*/),
              product_id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          images: [
            {
              id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          variants: [
            {
              id: "test-variant", // expect.stringMatching(/^test-variant*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^test-*/),
              prices: [
                {
                  id: expect.stringMatching(/^test-price*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^test-variant-option*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  option_id: expect.stringMatching(/^test-opt*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
            {
              id: "test-variant_2", // expect.stringMatching(/^test-variant*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^test-*/),
              prices: [
                {
                  id: expect.stringMatching(/^test-price*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^test-variant-option*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  option_id: expect.stringMatching(/^test-opt*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
            {
              id: "test-variant_1", // expect.stringMatching(/^test-variant*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^test-*/),
              prices: [
                {
                  id: expect.stringMatching(/^test-price*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^test-variant-option*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  option_id: expect.stringMatching(/^test-opt*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
          ],
          tags: [
            {
              id: expect.stringMatching(/^tag*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          type: {
            id: expect.stringMatching(/^test-*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          collection: {
            id: expect.stringMatching(/^test-*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          profile_id: expect.stringMatching(/^sp_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.stringMatching(/^test-*/),
          created_at: expect.any(String),
          options: [],
          variants: [
            {
              id: "test-variant_4", // expect.stringMatching(/^test-variant*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^test-*/),
              prices: [
                {
                  id: expect.stringMatching(/^test-price*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^test-variant-option*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  option_id: expect.stringMatching(/^test-opt*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
            {
              id: "test-variant_3", // expect.stringMatching(/^test-variant*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^test-*/),
              prices: [
                {
                  id: expect.stringMatching(/^test-price*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              options: [
                {
                  id: expect.stringMatching(/^test-variant-option*/),
                  variant_id: expect.stringMatching(/^test-variant*/),
                  option_id: expect.stringMatching(/^test-opt*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
          ],
          tags: [
            {
              id: expect.stringMatching(/^tag*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          type: {
            id: expect.stringMatching(/^test-*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          collection: {
            id: expect.stringMatching(/^test-*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          profile_id: expect.stringMatching(/^sp_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.stringMatching(/^test-*/),
          profile_id: expect.stringMatching(/^sp_*/),
          created_at: expect.any(String),
          type: expect.any(Object),
          collection: expect.any(Object),
          options: expect.any(Array),
          tags: expect.any(Array),
          variants: expect.any(Array),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.stringMatching(/^test-*/),
          profile_id: expect.stringMatching(/^sp_*/),
          created_at: expect.any(String),
          type: expect.any(Object),
          collection: expect.any(Object),
          options: expect.any(Array),
          tags: expect.any(Array),
          variants: expect.any(Array),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.stringMatching(/^test-*/),
          profile_id: expect.stringMatching(/^sp_*/),
          created_at: expect.any(String),
          type: expect.any(Object),
          collection: expect.any(Object),
          options: expect.any(Array),
          tags: expect.any(Array),
          variants: expect.any(Array),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })
  })

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a product", async () => {
      const api = useApi()

      const payload = {
        title: "Test",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test",
          discountable: true,
          is_giftcard: false,
          handle: "test",
          status: "draft",
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image.png",
            }),
            expect.objectContaining({
              url: "test-image-2.png",
            }),
          ]),
          thumbnail: "test-image.png",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
            expect.objectContaining({
              value: "456",
            }),
          ],
          type: expect.objectContaining({
            value: "test-type",
          }),
          collection: expect.objectContaining({
            id: "test-collection",
            title: "Test collection",
          }),
          options: [
            expect.objectContaining({
              title: "size",
            }),
            expect.objectContaining({
              title: "color",
            }),
          ],
          variants: [
            expect.objectContaining({
              title: "Test variant",
              prices: [
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 100,
                }),
              ],
              options: [
                expect.objectContaining({
                  value: "large",
                }),
                expect.objectContaining({
                  value: "green",
                }),
              ],
            }),
          ],
        })
      )
    })

    it("Sets variant ranks when creating a product", async () => {
      const api = useApi()

      const payload = {
        title: "Test product - 1",
        description: "test-product-description 1",
        type: { value: "test-type 1" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant 1",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
          {
            title: "Test variant 2",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const creationResponse = await api
        .post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(creationResponse.status).toEqual(200)

      const productId = creationResponse.data.product.id

      const response = await api
        .get(`/admin/products/${productId}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test product - 1",
          variants: [
            expect.objectContaining({
              title: "Test variant 1",
            }),
            expect.objectContaining({
              title: "Test variant 2",
            }),
          ],
        })
      )
    })

    it("creates a giftcard", async () => {
      const api = useApi()

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test Giftcard",
          discountable: false,
        })
      )
    })

    it("updates a product (update prices, tags, update status, delete collection, delete type, replaces images)", async () => {
      const api = useApi()

      const payload = {
        collection_id: null,
        type: null,
        variants: [
          {
            id: "test-variant",
            prices: [
              {
                currency_code: "usd",
                amount: 100,
                sale_amount: 75,
              },
            ],
          },
        ],
        tags: [{ value: "123" }],
        images: ["test-image-2.png"],
        type: { value: "test-type-2" },
        status: "published",
      }

      const response = await api
        .post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image-2.png",
            }),
          ]),
          thumbnail: "test-image-2.png",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
          ],
          variants: [
            expect.objectContaining({
              prices: [
                expect.objectContaining({
                  sale_amount: 75,
                  amount: 100,
                }),
              ],
            }),
          ],
          type: null,
          status: "published",
          collection: null,
          type: expect.objectContaining({
            value: "test-type-2",
          }),
        })
      )
    })

    it("updates product (removes images when empty array included)", async () => {
      const api = useApi()

      const payload = {
        images: [],
      }

      const response = await api
        .post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product.images.length).toEqual(0)
    })

    it("fails to update product with invalid status", async () => {
      const api = useApi()

      const payload = {
        status: null,
      }

      try {
        await api.post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
      } catch (e) {
        expect(e.response.status).toEqual(400)
        expect(e.response.data.type).toEqual("invalid_data")
      }
    })

    it("updates a product (variant ordering)", async () => {
      const api = useApi()

      const payload = {
        collection_id: null,
        type: null,
        variants: [
          {
            id: "test-variant",
          },
          {
            id: "test-variant_1",
          },
          {
            id: "test-variant_2",
          },
        ],
      }

      const response = await api
        .post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test product",
          variants: [
            expect.objectContaining({
              id: "test-variant",
              title: "Test variant",
            }),
            expect.objectContaining({
              id: "test-variant_1",
              title: "Test variant rank (1)",
            }),
            expect.objectContaining({
              id: "test-variant_2",
              title: "Test variant rank (2)",
            }),
          ],
          type: null,
          collection: null,
        })
      )
    })

    it("add option", async () => {
      const api = useApi()

      const payload = {
        title: "should_add",
      }

      const response = await api
        .post("/admin/products/test-product/options", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          options: expect.arrayContaining([
            expect.objectContaining({
              title: "should_add",
              product_id: "test-product",
            }),
          ]),
        })
      )
    })
  })

  describe("testing for soft-deletion + uniqueness on handles, collection and variant properties", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully deletes a product", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-product",
          deleted: true,
        })
      )
    })

    it("successfully deletes a product and variants", async () => {
      const api = useApi()

      const variantPre = await dbConnection.manager.findOne(ProductVariant, {
        id: "test-variant",
      })

      expect(variantPre).not.toEqual(undefined)

      const response = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-product",
          deleted: true,
        })
      )

      const variant = await dbConnection.manager.findOne(ProductVariant, {
        id: "test-variant",
      })

      expect(variant).toEqual(undefined)
    })

    it("successfully creates product with soft-deleted product handle and deletes it again", async () => {
      const api = useApi()

      // First we soft-delete the product
      const response = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-product")

      // Lets try to create a product with same handle as deleted one
      const payload = {
        title: "Test product",
        handle: "test-product",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const res = await api.post("/admin/products", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.product.handle).toEqual("test-product")

      // Delete product again to ensure uniqueness is enforced in all cases
      const response2 = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response2.status).toEqual(200)
      expect(response2.data.id).toEqual("test-product")
    })

    it("should fail when creating a product with a handle that already exists", async () => {
      const api = useApi()

      // Lets try to create a product with same handle as deleted one
      const payload = {
        title: "Test product",
        handle: "test-product",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      try {
        await api.post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
      } catch (error) {
        expect(error.response.data.message).toMatch(
          /duplicate key value violates unique constraint/i
        )
      }
    })

    it("successfully deletes product collection", async () => {
      const api = useApi()

      // First we soft-delete the product collection
      const response = await api
        .delete("/admin/collections/test-collection", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-collection")
    })

    it("successfully creates soft-deleted product collection", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/collections/test-collection", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-collection")

      // Lets try to create a product collection with same handle as deleted one
      const payload = {
        title: "Another test collection",
        handle: "test-collection",
      }

      const res = await api.post("/admin/collections", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.collection.handle).toEqual("test-collection")
    })

    it("should fail when creating a collection with a handle that already exists", async () => {
      const api = useApi()

      // Lets try to create a collection with same handle as deleted one
      const payload = {
        title: "Another test collection",
        handle: "test-collection",
      }

      try {
        await api.post("/admin/collections", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
      } catch (error) {
        expect(error.response.data.message).toMatch(
          /duplicate key value violates unique constraint/i
        )
      }
    })

    it("successfully creates soft-deleted product variant", async () => {
      const api = useApi()

      const product = await api
        .get("/admin/products/test-product", {
          headers: {
            Authorization: "bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .delete("/admin/products/test-product/variants/test-variant", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variant_id).toEqual("test-variant")

      const payload = {
        title: "Second variant",
        sku: "test-sku",
        ean: "test-ean",
        upc: "test-upc",
        barcode: "test-barcode",
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
        options: [{ option_id: "test-option", value: "inserted value" }],
      }

      const res = await api
        .post("/admin/products/test-product/variants", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => console.log(err))

      expect(res.status).toEqual(200)
      expect(res.data.product.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Second variant",
            sku: "test-sku",
            ean: "test-ean",
            upc: "test-upc",
            barcode: "test-barcode",
          }),
        ])
      )
    })
  })
})
