import {
  AdminPostStockLocationsReq,
  SalesChannel,
  StockLocationAddressDTO,
  StockLocationAddressInput,
} from "@medusajs/medusa"
import GeneralForm, { GeneralFormType } from "../components/general-form"
import {
  useAdminAddLocationToSalesChannel,
  useAdminCreateStockLocation,
} from "medusa-react"

import Accordion from "../../../../components/organisms/accordion"
import AddressForm from "../components/address-form"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import DeletePrompt from "../../../../components/organisms/delete-prompt"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import SalesChannelsForm from "../components/sales-channels-form"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { useForm } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"

type NewLocationForm = {
  general: GeneralFormType
  address: StockLocationAddressDTO
  salesChannels: {
    channels: SalesChannel[]
  }
}

const NewLocation = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<NewLocationForm>({
    defaultValues: {
      general: {
        name: "",
      },
      address: undefined,
      salesChannels: {
        channels: [],
      },
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })
  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const {
    state: isShowingClosePrompt,
    open: showClosePrompt,
    close: closeClosePrompt,
  } = useToggleState()

  const notification = useNotification()
  const { isFeatureEnabled } = useFeatureFlag()

  const { mutateAsync: createStockLocation } = useAdminCreateStockLocation()
  const { mutateAsync: associateSalesChannel } =
    useAdminAddLocationToSalesChannel()

  const createSalesChannelAssociationPromise = (salesChannelId, locationId) =>
    associateSalesChannel({
      sales_channel_id: salesChannelId,
      location_id: locationId,
    })

  const handleClose = () => {
    if (!isDirty) {
      onClose()
    } else {
      showClosePrompt()
    }
  }

  const onSubmit = () =>
    handleSubmit(async (data) => {
      const { locationPayload, salesChannelsPayload } = createPayload(data)
      try {
        const { stock_location } = await createStockLocation(locationPayload)
        Promise.all(
          salesChannelsPayload.map((salesChannel) =>
            createSalesChannelAssociationPromise(
              salesChannel.id,
              stock_location.id
            )
          )
        )
          .then(() => {
            notification("Success", "Location added successfully", "success")
          })
          .catch(() => {
            notification(
              "Error",
              "Location was created successfully, but there was an error associating sales channels",
              "error"
            )
          })
          .finally(() => {
            onClose()
          })
      } catch (err) {
        notification("Error", getErrorMessage(err), "error")
      }
    })

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 flex w-full justify-between px-8">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={handleClose}
            >
              <CrossIcon size={20} />
            </Button>
            {isShowingClosePrompt && (
              <DeletePrompt
                heading="Are you sure you want to cancel with unsaved changes"
                confirmText="Yes, cancel"
                cancelText="No, continue creating"
                successText={undefined}
                handleClose={closeClosePrompt}
                onDelete={async () => onClose()}
              />
            )}
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="primary"
                type="button"
                disabled={!isDirty || !isValid}
                onClick={onSubmit()}
              >
                Add location
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
            <h1 className="mb-base text-grey-90 text-xlarge px-1 font-semibold">
              Add new location
            </h1>
            <Accordion defaultValue={"general"} type="single">
              <Accordion.Item
                value={"general"}
                title={"General Information"}
                required
              >
                <p className="inter-base-regular text-grey-50">
                  Specify the details about this location
                </p>
                <div className="mt-xlarge gap-y-xlarge flex flex-col pb-0.5">
                  <GeneralForm form={nestedForm(form, "general")} />
                  <AddressForm form={nestedForm(form, "address")} />
                </div>
              </Accordion.Item>
              {isFeatureEnabled("sales_channels") && (
                <Accordion.Item
                  value={"sales_channels"}
                  title={"Sales Channels"}
                >
                  <p className="inter-base-regular text-grey-50">
                    Specify which Sales Channels this location's items can be
                    purchased through.
                  </p>
                  <div className="mt-xlarge flex">
                    <SalesChannelsForm
                      location={null}
                      form={nestedForm(form, "salesChannels")}
                    />
                  </div>
                </Accordion.Item>
              )}
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
  data
): {
  locationPayload: AdminPostStockLocationsReq
  salesChannelsPayload: SalesChannel[]
} => {
  const { general, address } = data

  let addressInput
  if (address.address_1) {
    addressInput = address as StockLocationAddressInput
    addressInput.country_code = address.country_code.value
  }
  return {
    locationPayload: { name: general.name, address: addressInput },
    salesChannelsPayload: data.salesChannels.channels,
  }
}

export default NewLocation
