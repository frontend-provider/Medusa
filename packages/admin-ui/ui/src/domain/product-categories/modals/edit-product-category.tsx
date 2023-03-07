import { useEffect, useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import { useAdminUpdateProductCategory } from "medusa-react"

import SideModal from "../../../components/molecules/modal/side-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import useNotification from "../../../hooks/use-notification"

const visibilityOptions = [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
]

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

type EditProductCategoriesSideModalProps = {
  activeCategory: ProductCategory
  close: () => void
  isVisible: boolean
}

/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close, activeCategory } = props

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const notification = useNotification()

  const { mutateAsync: updateCategory } = useAdminUpdateProductCategory(
    activeCategory?.id
  )

  useEffect(() => {
    if (activeCategory) {
      setName(activeCategory.name)
      setHandle(activeCategory.handle)
      setIsActive(activeCategory.is_active)
      setIsPublic(!activeCategory.is_internal)
    }
  }, [activeCategory])

  const onSave = async () => {
    try {
      await updateCategory({
        name,
        handle,
        is_active: isActive,
        is_internal: !isPublic,
      })

      notification("Success", "Product category updated", "success")
    } catch (e) {
      notification("Error", "Failed to update the category", "error")
    }
    close()
  }

  const onClose = () => {
    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            Edit product category
          </h3>
          <Button
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <InputField
            label="Name"
            type="string"
            name="name"
            value={name}
            className="my-6"
            placeholder="Give this category a name"
            onChange={(ev) => setName(ev.target.value)}
          />

          <InputField
            label="Handle"
            type="string"
            name="handle"
            value={handle}
            className="my-6"
            placeholder="Custom handle"
            onChange={(ev) => setHandle(ev.target.value)}
          />

          <Select
            label="Status"
            options={statusOptions}
            menuPortalStyles={{ zIndex: 300 }}
            value={statusOptions[isActive ? 0 : 1]}
            onChange={(o) => setIsActive(o.value === "active")}
          />

          <Select
            className="my-6"
            label="Visibility"
            options={visibilityOptions}
            menuPortalStyles={{ zIndex: 300 }}
            value={visibilityOptions[isPublic ? 0 : 1]}
            onChange={(o) => setIsPublic(o.value === "public")}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="block h-[1px] bg-gray-200"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSave}>
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
