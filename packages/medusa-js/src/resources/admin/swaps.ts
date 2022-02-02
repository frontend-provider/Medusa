import {
  AdminSwapsRes,
  AdminSwapsListRes,
  AdminGetSwapsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminSwapsResource extends BaseResource {
  retrieve(id: string): ResponsePromise<AdminSwapsRes> {
    const path = `/admin/swaps/${id}`
    return this.client.request("GET", path)
  }

  list(query?: AdminGetSwapsParams): ResponsePromise<AdminSwapsListRes> {
    let path = `/admin/swaps/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/swaps?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminSwapsResource
