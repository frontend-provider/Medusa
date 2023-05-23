import Button from "../../../../fundamentals/button"
import { Controller } from "react-hook-form"
import InputField from "../../../../molecules/input"
import ItemSearch from "../../../../molecules/item-search"
import LocationDropdown from "../../../../molecules/location-dropdown"
import { NestedForm } from "../../../../../utils/nested-form"
import { DecoratedInventoryItemDTO } from "@medusajs/medusa"
import React from "react"

export type GeneralFormType = {
  location: string
  items: Partial<DecoratedInventoryItemDTO>
  description: string
  quantity: number
}

type Props = {
  form: NestedForm<GeneralFormType>
}

const ReservationForm: React.FC<Props> = ({ form }) => {
  const { register, path, watch, control, setValue } = form

  const selectedItem = watch(path("item"))
  const selectedLocation = watch(path("location"))

  const locationLevel = selectedItem?.location_levels?.find(
    (l) => l.location_id === selectedLocation
  )

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="inter-base-semibold mb-1">Location</p>
          <p className="text-grey-50">Choose where you wish to reserve from.</p>
        </div>
        <Controller
          control={control}
          name={path("location")}
          render={({ field: { onChange } }) => {
            return (
              <LocationDropdown
                onChange={onChange}
                selectedLocation={selectedLocation}
              />
            )
          }}
        />
      </div>
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="inter-base-semibold mb-1">Item to reserve</p>
          <p className="text-grey-50">
            Select the item that you wish to reserve.
          </p>
        </div>
        <Controller
          control={control}
          name={path("item")}
          render={({ field: { onChange } }) => {
            return (
              <ItemSearch
                onItemSelect={onChange}
                clearOnSelect={true}
                filters={{ location_id: selectedLocation }}
              />
            )
          }}
        />
        {selectedItem && locationLevel && (
          <div className="col-span-2 flex w-full flex-col">
            <div
              className={`
            bg-grey-5 text-grey-50 border-grey-20 
            mt-8
            grid border-collapse grid-cols-2 grid-rows-5 
            [&>*]:border-r [&>*]:border-b [&>*]:py-2 
            [&>*:nth-child(odd)]:border-l [&>*:nth-child(odd)]:pl-4 
            [&>*:nth-child(even)]:pr-4 [&>*:nth-child(even)]:text-right 
            [&>*:nth-child(-n+2)]:border-t`}
            >
              <div className="rounded-tl-rounded">Item</div>
              <div className="rounded-tr-rounded">
                {selectedItem!.title ?? "N/A"}
              </div>
              <div>SKU</div>
              <div>{selectedItem.sku ?? "N/A"}</div>
              <div>In stock</div>
              <div>{locationLevel?.stocked_quantity}</div>
              <div>Available</div>
              <div>
                {locationLevel?.stocked_quantity -
                  locationLevel?.reserved_quantity}
              </div>
              <div className="rounded-bl-rounded">Reserve</div>
              <div className="bg-grey-0 rounded-br-rounded text-grey-80 flex items-center">
                <input
                  className="remove-number-spinner inter-base-regular w-full shrink border-none bg-transparent text-right font-normal outline-none outline-0"
                  {...register(path("quantity"), {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={0}
                  max={
                    locationLevel?.stocked_quantity -
                    locationLevel?.reserved_quantity
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button
                variant="ghost"
                className="border"
                size="small"
                type="button"
                onClick={() => setValue(path("item"), undefined)}
              >
                Remove item
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="border-grey border-grey-20 grid w-full grid-cols-2 items-center border-t py-6">
        <div>
          <p className="inter-base-semibold mb-1">Description</p>
          <p className="text-grey-50">What type of reservation is this?</p>
        </div>
        <InputField
          {...register(path("description"))}
          placeholder="Description"
        />
      </div>
    </div>
  )
}

export default ReservationForm
