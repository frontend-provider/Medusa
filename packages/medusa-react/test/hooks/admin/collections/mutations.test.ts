import {
  useAdminCreateCollection,
  useAdminUpdateCollection,
  useAdminDeleteCollection,
} from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminCreateCollection hook", () => {
  test("creates a collection and returns it", async () => {
    const collection = {
      title: "test_collection",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateCollection(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(collection)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.collection).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_collection"),
        ...collection,
      })
    )
  })
})

describe("useAdminUpdateCollection hook", () => {
  test("updates a collection and returns it", async () => {
    const collection = {
      title: "update_collection",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(collection)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.collection).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_collection"),
        ...collection,
      })
    )
  })
})

describe("useAdminDeleteCollection hook", () => {
  test("deletes a collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("product_collection").id,
        deleted: true,
      })
    )
  })
})
