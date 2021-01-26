import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { DiscountServiceMock } from "../../../../../services/__mocks__/discount"

describe("GET /admin/discounts", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/discounts`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(DiscountServiceMock.list).toHaveBeenCalledTimes(1)
    })
  })

  describe("expand region filter", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/discounts?expand_fields=regions`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(DiscountServiceMock.list).toHaveBeenCalledTimes(1)
    })
  })
})
