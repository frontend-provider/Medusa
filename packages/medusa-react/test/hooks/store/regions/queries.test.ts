import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"
import { useRegion, useRegions } from "../../../../src/"

describe("useRegions hook", () => {
  test("success", async () => {
    const regions = fixtures.list("region")
    const { result, waitFor } = renderHook(() => useRegions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.regions).toEqual(regions)
  })
})

describe("useRegion hook", () => {
  test("success", async () => {
    const region = fixtures.get("region")
    const { result, waitFor } = renderHook(() => useRegion(region.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.region).toEqual(region)
  })
})
