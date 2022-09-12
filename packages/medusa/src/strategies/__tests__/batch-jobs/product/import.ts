import { Readable, PassThrough } from "stream"
import { EntityManager } from "typeorm"

import { FileService } from "medusa-interfaces"
import { IdMap, MockManager } from "medusa-test-utils"

import { User } from "../../../../models"
import { BatchJobStatus } from "../../../../types/batch-job"
import ProductImportStrategy from "../../../batch-jobs/product/import"
import {
  BatchJobService,
  ProductService,
  ProductVariantService,
  RegionService,
  ShippingProfileService,
} from "../../../../services"
import { InjectedProps } from "../../../batch-jobs/product/types"
import { FlagRouter } from "../../../../utils/flag-router"

let fakeJob = {
  id: IdMap.getId("product-import-job"),
  type: "product-import",
  context: {
    csvFileKey: "csv.key",
  },
  results: { advancement_count: 0, count: 6 },
  created_by: IdMap.getId("product-import-creator"),
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING,
}

async function* generateCSVDataForStream() {
  yield "Product id,Product Handle,Product Title,Product Subtitle,Product Description,Product Status,Product Thumbnail,Product Weight,Product Length,Product Width,Product Height,Product HS Code,Product Origin Country,Product MID Code,Product Material,Product Collection Title,Product Collection Handle,Product Type,Product Tags,Product Discountable,Product External ID,Product Profile Name,Product Profile Type,Variant id,Variant Title,Variant SKU,Variant Barcode,Variant Inventory Quantity,Variant Allow backorder,Variant Manage inventory,Variant Weight,Variant Length,Variant Width,Variant Height,Variant HS Code,Variant Origin Country,Variant MID Code,Variant Material,Price france [USD],Price USD,Price denmark [DKK],Price Denmark [DKK],Option 1 Name,Option 1 Value,Option 2 Name,Option 2 Value,Image 1 Url\n"
  yield "O6S1YQ6mKm,test-product-product-1,Test product,,test-product-description-1,draft,,,,,,,,,,Test collection 1,test-collection1,test-type-1,123_1,TRUE,,profile_1,profile_type_1,SebniWTDeC,Test variant,test-sku-1,test-barcode-1,10,FALSE,TRUE,,,,,,,,,100,110,130,,test-option-1,option 1 value red,test-option-2,option 2 value 1,test-image.png\n"
  yield "5VxiEkmnPV,test-product-product-2,Test product,,test-product-description,draft,,,,,,,,,,Test collection,test-collection2,test-type,123,TRUE,,profile_2,profile_type_2,CaBp7amx3r,Test variant,test-sku-2,test-barcode-2,10,FALSE,TRUE,,,,,,,,,,,,110,test-option,Option 1 value 1,,,test-image.png\n"
  yield "5VxiEkmnPV,test-product-product-2,Test product,,test-product-description,draft,,,,,,,,,,Test collection,test-collection2,test-type,123,TRUE,,profile_2,profile_type_2,3SS1MHGDEJ,Test variant,test-sku-3,test-barcode-3,10,FALSE,TRUE,,,,,,,,,,120,,,test-option,Option 1 Value blue,,,test-image.png\n"
}

/* ******************** SERVICES MOCK ******************** */

const fileServiceMock = {
  withTransaction: function () {
    return this
  },
  delete: jest.fn(),
  getDownloadStream: jest.fn().mockImplementation(() => {
    return Promise.resolve(Readable.from(generateCSVDataForStream()))
  }),
  getUploadStreamDescriptor: jest.fn().mockImplementation(() => ({
    writeStream: new PassThrough(),
    promise: Promise.resolve(),
  })),
}

const batchJobServiceMock = {
  withTransaction: function () {
    return this
  },
  update: jest.fn().mockImplementation((data) => {
    fakeJob = {
      ...fakeJob,
      ...data,
    }
    return Promise.resolve(fakeJob)
  }),
  complete: jest.fn().mockImplementation(() => {
    fakeJob.status = BatchJobStatus.COMPLETED
    return Promise.resolve(fakeJob)
  }),
  confirmed: jest.fn().mockImplementation(() => {
    fakeJob.status = BatchJobStatus.CONFIRMED
    return Promise.resolve(fakeJob)
  }),
  retrieve: jest.fn().mockImplementation(() => {
    return Promise.resolve(fakeJob)
  }),
}

const productServiceMock = {
  withTransaction: function () {
    return this
  },
  count: jest.fn().mockImplementation(() => Promise.resolve()),
}

const shippingProfileServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieveDefault: jest.fn().mockImplementation((_data) => {
    return Promise.resolve({ id: "default_shipping_profile" })
  }),
}

const productVariantServiceMock = {
  withTransaction: function () {
    return this
  },
  count: jest.fn().mockImplementation(() => Promise.resolve()),
}

const regionServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieveByName: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: "reg_HMnixPlOicAs7aBlXuchAGxd",
      name: "Denmark",
      currency_code: "DKK",
      currency: "DKK",
      tax_rate: 0.25,
      tax_code: null,
      countries: [
        {
          id: "1001",
          iso_2: "DK",
          iso_3: "DNK",
          num_code: "208",
          name: "denmark",
          display_name: "Denmark",
        },
      ],
    })
  ),
}

const managerMock = MockManager

/* ******************** PRODUCT IMPORT STRATEGY TESTS ******************** */

describe("Product import strategy", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  const productImportStrategy = new ProductImportStrategy({
    manager: managerMock as EntityManager,
    fileService: fileServiceMock as typeof FileService,
    batchJobService: batchJobServiceMock as unknown as BatchJobService,
    productService: productServiceMock as unknown as ProductService,
    shippingProfileService:
      shippingProfileServiceMock as unknown as ShippingProfileService,
    productVariantService:
      productVariantServiceMock as unknown as ProductVariantService,
    regionService: regionServiceMock as unknown as RegionService,
    featureFlagRouter: new FlagRouter({}),
  } as unknown as InjectedProps)

  it("`preProcessBatchJob` should generate import ops and upload them to a bucket using the file service", async () => {
    const getImportInstructionsSpy = jest.spyOn(
      productImportStrategy,
      "getImportInstructions"
    )

    await productImportStrategy.preProcessBatchJob(fakeJob.id)

    expect(getImportInstructionsSpy).toBeCalledTimes(1)

    expect(fileServiceMock.getUploadStreamDescriptor).toBeCalledTimes(2)

    expect(fileServiceMock.getUploadStreamDescriptor).toHaveBeenNthCalledWith(
      1,
      {
        ext: "json",
        name: `imports/products/ops/${fakeJob.id}-PRODUCT_CREATE`,
      }
    )
    expect(fileServiceMock.getUploadStreamDescriptor).toHaveBeenNthCalledWith(
      2,
      {
        ext: "json",
        name: `imports/products/ops/${fakeJob.id}-VARIANT_UPDATE`, // because row data has variant.id
      }
    )

    getImportInstructionsSpy.mockRestore()
  })
})
