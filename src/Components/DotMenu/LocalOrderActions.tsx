import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Row } from '@tanstack/react-table'
import { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { usePopupState } from 'material-ui-popup-state/hooks'
import { errAsync, okAsync } from 'neverthrow'
import { getOrderActions } from '../../utils/getLocalOrderActions'
import { searchShortOrders } from '../../utils/inventoryManagement'
import { ExtendedShortOrder } from '../../Pages/localOrdersPage'

type Option = {
  id: string
  label: string
  action: (() => void) | null
}

type LocalOrderActionsProps = {
  row: Row<ExtendedShortOrder>
}

export default function LocalOrderActions({ row }: LocalOrderActionsProps) {
  const [options, setOptions] = React.useState<Option[]>([])
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'dotMenuActions',
  })
  // reference to keep track whether the popup is still open or not, once the data comes back from the db.
  const openRef = React.useRef(popupState.isOpen)

  React.useEffect(() => {
    openRef.current = popupState.isOpen
    if (!popupState.isOpen) {
      setOptions([
        {
          id: 'loading',
          label: 'loading...',
          action: null,
        },
      ])
    } else {
      searchShortOrders(row.original.orderNumber)
        .andThen((orders) => {
          if (orders.length !== 1) {
            return errAsync(new Error('no order found'))
          }
          const order = orders[0]
          console.log('received order from db:', order)
          const stillOpened = openRef.current
          if (stillOpened) {
            setOptions(getOrderActions(order))
          }
          return okAsync(order)
        })
        .mapErr((error) => {
          console.log('error:', error)
          return error
        })
    }
  }, [popupState.isOpen, row])

  // need to click and wait for the data to come back.

  return (
    <>
      <IconButton {...bindTrigger(popupState)}>
        <MoreVertIcon />
      </IconButton>

      <Menu {...bindMenu(popupState)}>
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => {
              if (typeof option.action === 'function') {
                option.action()
              }
              popupState.close()
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
