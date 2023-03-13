import { Currency } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminUpdateStore } from "medusa-react"
import { useMemo, useState } from "react"
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { useAddCurrenciesModalScreen } from "./add-currencies-screen"
import { useEditCurrenciesModal } from "./edit-currencies-modal"
import CurrenciesTable from "./table"
import { useCurrencyColumns } from "./use-currency-table-columns"

const LIMIT = 15

const CurrentCurrenciesScreen = () => {
  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const { onClose, store } = useEditCurrenciesModal()

  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()

  const onSubmit = (currencies: string[]) => {
    mutate(
      {
        currencies,
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated currencies", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const columns = useCurrencyColumns()

  const filteredCurrencies = useMemo(() => {
    return store.currencies.slice(offset, offset + LIMIT)
  }, [store, offset])

  const tableState = useTable<Currency>(
    {
      data: filteredCurrencies || [],
      columns,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.code,
      pageCount: Math.ceil((store.currencies.length || 0) / LIMIT),
    },
    useSortBy,
    usePagination,
    useRowSelect
  )

  const onDeselect = () => {
    setSelectedRowIds([])
    tableState.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    const currencies = store.currencies
      .filter((sc) => !selectedRowIds.includes(sc.code))
      .map((c) => c.code)
    onSubmit(currencies)
    onDeselect()
  }

  return (
    <>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Current Store Currencies</h1>
      </Modal.Header>
      <Modal.Content>
        <CurrenciesTable
          isLoading={false}
          setQuery={() => {}}
          setSelectedRowIds={setSelectedRowIds}
          count={store.currencies?.length || 0}
          tableState={tableState}
          setOffset={setOffset}
          offset={offset}
          tableAction={
            <TableActions
              numberOfSelectedRows={selectedRowIds.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
            />
          }
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end">
          <Button variant="primary" size="small" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

type TableActionProps = {
  numberOfSelectedRows: number
  onRemove: () => void
  onDeselect: () => void
}

const TableActions = ({
  numberOfSelectedRows,
  onDeselect,
  onRemove,
}: TableActionProps) => {
  const showAdd = !!numberOfSelectedRows

  const { screen, push } = useAddCurrenciesModalScreen()

  const classes = {
    "translate-y-[-42px]": !showAdd,
    "translate-y-[0px]": showAdd,
  }

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
            onClick={() => push(screen)}
          >
            <PlusIcon size={20} /> Add Currencies
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CurrentCurrenciesScreen
