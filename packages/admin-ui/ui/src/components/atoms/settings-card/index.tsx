import React from "react"
import { Link } from "react-router-dom"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"

type SettingsCardProps = {
  icon: React.ReactNode
  heading: string
  description: string
  to?: string
  externalLink?: string
  disabled?: boolean
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  heading,
  description,
  to = null,
  externalLink = null,
  disabled = false,
}) => {
  if (disabled) {
    to = null
  }

  return (
    <Link to={to ?? ""} className="flex flex-1 items-center">
      <button
        className="bg-grey-0 rounded-rounded p-large border-grey-20 group flex h-full flex-1 items-center border"
        disabled={disabled}
        onClick={() => {
          if (externalLink) {
            window.location.href = externalLink
          }
        }}
      >
        <div className="h-2xlarge w-2xlarge bg-grey-10 rounded-circle text-grey-60 group-disabled:bg-grey-10 group-disabled:text-grey-40 flex items-center justify-center">
          {icon}
        </div>
        <div className="mx-large flex-1 text-left">
          <h3 className="inter-large-semibold text-grey-90 group-disabled:text-grey-40 m-0">
            {heading}
          </h3>
          <p className="inter-base-regular text-grey-50 group-disabled:text-grey-40 m-0">
            {description}
          </p>
        </div>
        <div className="text-grey-40 group-disabled:text-grey-30">
          <ChevronRightIcon />
        </div>
      </button>
    </Link>
  )
}

export default SettingsCard
