import { Product } from "@medusajs/medusa"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import ChannelsIcon from "../../../../../components/fundamentals/icons/channels-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import SalesChannelsDisplay from "../../../../../components/molecules/sales-channels-display"
import StatusSelector from "../../../../../components/molecules/status-selector"
import DelimitedList from "../../../../../components/molecules/delimited-list"
import Section from "../../../../../components/organisms/section"
import {
  useFeatureFlag,
  FeatureFlag,
} from "../../../../../providers/feature-flag-provider"
import useToggleState from "../../../../../hooks/use-toggle-state"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import ChannelsModal from "./channels-modal"
import GeneralModal from "./general-modal"

type Props = {
  product: Product
}

const GeneralSection = ({ product }: Props) => {
  const { onDelete, onStatusChange } = useEditProductActions(product.id)
  const {
    state: infoState,
    close: closeInfo,
    toggle: toggleInfo,
  } = useToggleState()

  const {
    state: channelsState,
    close: closeChannels,
    toggle: toggleChannels,
  } = useToggleState(false)

  const { isFeatureEnabled } = useFeatureFlag()

  const actions: ActionType[] = [
    {
      label: "Edit General Information",
      onClick: toggleInfo,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  if (isFeatureEnabled("sales_channels")) {
    actions.splice(1, 0, {
      label: "Edit Sales Channels",
      onClick: toggleChannels,
      icon: <ChannelsIcon size={20} />,
    })
  }

  return (
    <>
      <Section
        title={product.title}
        actions={actions}
        forceDropdown
        status={
          <StatusSelector
            isDraft={product?.status === "draft"}
            activeState="Published"
            draftState="Draft"
            onChange={() => onStatusChange(product.status)}
          />
        }
      >
        <p className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap">
          {product.description}
        </p>
        <ProductTags product={product} />
        <ProductDetails product={product} />
        <ProductSalesChannels product={product} />
      </Section>

      <GeneralModal product={product} open={infoState} onClose={closeInfo} />

      <FeatureToggle featureFlag="sales_channels">
        <ChannelsModal
          product={product}
          open={channelsState}
          onClose={closeChannels}
        />
      </FeatureToggle>
    </>
  )
}

type DetailProps = {
  title: string
  value?: string[] | string | null
}

const Detail = ({ title, value }: DetailProps) => {
  const DetailValue = () => {
    if (!Array.isArray(value)) {
      return <p>{value ? value : "–"}</p>
    }

    if (value.length) {
      return <DelimitedList list={value} delimit={2} />
    }

    return <p>–</p>
  }

  return (
    <div className="inter-base-regular text-grey-50 flex items-center justify-between">
      <p>{title}</p>
      <DetailValue />
    </div>
  )
}

const ProductDetails = ({ product }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()

  return (
    <div className="mt-8 flex flex-col gap-y-3">
      <h2 className="inter-base-semibold">Details</h2>
      <Detail title="Subtitle" value={product.subtitle} />
      <Detail title="Handle" value={product.handle} />
      <Detail title="Type" value={product.type?.value} />
      <Detail title="Collection" value={product.collection?.title} />
      {isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES) && (
        <Detail
          title="Category"
          value={product.categories.map((c) => c.name)}
        />
      )}
      <Detail
        title="Discountable"
        value={product.discountable ? "True" : "False"}
      />
    </div>
  )
}

const ProductTags = ({ product }: Props) => {
  if (product.tags?.length === 0) {
    return null
  }

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-1">
      {product.tags.map((t) => (
        <li key={t.id}>
          <div className="text-grey-50 bg-grey-10 inter-small-semibold rounded-rounded px-3 py-[6px]">
            {t.value}
          </div>
        </li>
      ))}
    </ul>
  )
}

const ProductSalesChannels = ({ product }: Props) => {
  return (
    <FeatureToggle featureFlag="sales_channels">
      <div className="mt-xlarge">
        <h2 className="inter-base-semibold mb-xsmall">Sales channels</h2>
        <SalesChannelsDisplay channels={product.sales_channels} />
      </div>
    </FeatureToggle>
  )
}

export default GeneralSection
