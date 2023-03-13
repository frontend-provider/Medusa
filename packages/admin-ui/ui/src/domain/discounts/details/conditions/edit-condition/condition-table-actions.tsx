import clsx from "clsx"
import { useContext } from "react"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { useAddConditionsModalScreen } from "./add-conditions-screens"
import { useEditConditionContext } from "./edit-condition-provider"

type Props = {
  numberOfSelectedRows: number
  onDeselect: () => void
  onRemove: () => void
}

const ExistingConditionTableActions = ({
  numberOfSelectedRows,
  onDeselect,
  onRemove,
}: Props) => {
  const { condition } = useEditConditionContext()

  const addConditionsModalScreen = useAddConditionsModalScreen(condition)

  const showAddConditions = !!numberOfSelectedRows

  const classes = {
    "translate-y-[-42px]": !showAddConditions,
    "translate-y-[0px]": showAddConditions,
  }

  const { push } = useContext(LayeredModalContext)

  return (
    <div className="space-x-xsmall flex h-[34px] overflow-hidden">
      <div className={clsx("transition-all duration-200", classes)}>
        <div className="mb-2 flex h-[34px] items-center divide-x">
          <span className="inter-small-regular text-grey-50 mr-3">
            {numberOfSelectedRows} selected
          </span>
          <div className="space-x-xsmall flex pl-3">
            <Button
              onClick={onDeselect}
              size="small"
              variant="ghost"
              className="border-grey-20 border"
            >
              Deselect
            </Button>
            <Button
              onClick={onRemove}
              size="small"
              variant="ghost"
              className="border-grey-20 border text-rose-50"
            >
              Remove
            </Button>
          </div>
        </div>
        <div className="flex h-[34px] justify-end">
          <Button
            size="small"
            variant="ghost"
            className="border-grey-20 border"
            onClick={() => push(addConditionsModalScreen)}
          >
            <PlusIcon size={20} /> Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExistingConditionTableActions
