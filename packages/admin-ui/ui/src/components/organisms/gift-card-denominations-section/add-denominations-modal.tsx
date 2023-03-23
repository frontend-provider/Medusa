import { Product } from "@medusajs/medusa"
import { useAdminCreateVariant, useAdminStore } from "medusa-react"
import { useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import DenominationForm, {
  DenominationFormType,
} from "../../forms/gift-card/denomination-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type Props = {
  /**
   * Whether the modal is open or not
   */
  open: boolean
  /**
   * Callback to close the modal
   */
  onClose: () => void
  /**
   * Gift card
   */
  giftCard: Product
}

type AddDenominationModalFormType = {
  denominations: DenominationFormType
}

const AddDenominationModal = ({ open, onClose, giftCard }: Props) => {
  const { mutate, isLoading: isMutating } = useAdminCreateVariant(giftCard.id)

  const { store } = useAdminStore()

  const defaultValues: AddDenominationModalFormType | undefined =
    useMemo(() => {
      if (!store) {
        return undefined
      }

      return {
        denominations: {
          defaultDenomination: {
            currency_code: store.default_currency_code,
            includes_tax: store.currencies.find(
              (c) => c.code === store.default_currency_code
            )?.includes_tax,
          },
          currencyDenominations: store.currencies
            .filter((c) => c.code !== store.default_currency_code)
            .map((currency) => {
              return {
                currency_code: currency.code,
                includes_tax: currency.includes_tax,
              }
            }),
        },
      } as AddDenominationModalFormType
    }, [store])

  const form = useForm<AddDenominationModalFormType>({
    defaultValues,
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const notification = useNotification()

  const handleClose = useCallback(() => {
    reset(defaultValues)
    onClose()
  }, [reset, defaultValues, onClose])

  const onSubmit = handleSubmit((data) => {
    const payload = {
      title: `${giftCard.variants.length}`,
      options: [
        {
          value: `${data.denominations.defaultDenomination.amount}`,
          option_id: giftCard.options[0].id,
        },
      ],
      prices: [
        {
          amount: data.denominations.defaultDenomination.amount,
          currency_code: data.denominations.defaultDenomination.currency_code,
        },
      ],
      inventory_quantity: 0,
      manage_inventory: false,
    }

    data.denominations.currencyDenominations.forEach((currency) => {
      if (
        (currency.amount !== null && currency.amount !== undefined) ||
        data.denominations.useSameValue
      ) {
        payload.prices.push({
          amount: data.denominations.useSameValue
            ? data.denominations.defaultDenomination.amount
            : currency.amount,
          currency_code: currency.currency_code,
        })
      }
    })

    mutate(payload, {
      onSuccess: () => {
        notification(
          "Denomination added",
          "A new denomination was succesfully added",
          "success"
        )
        handleClose()
      },
      onError: (error) => {
        const errorMessage = () => {
          // @ts-ignore
          if (error.response?.data?.type === "duplicate_error") {
            return `A denomination with that default value already exists`
          } else {
            return getErrorMessage(error)
          }
        }

        notification("Error", errorMessage(), "error")
      },
    })
  })

  return (
    <Modal open={open} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h1 className="inter-xlarge-semibold">Add Denomination</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <DenominationForm form={nestedForm(form, "denominations")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={isMutating || !isDirty}
                loading={isMutating}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default AddDenominationModal
