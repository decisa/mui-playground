import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const newOptions = [
  {
    id: 'addDelivery',
    label: 'Add Delivery',
    action: () => console.log('add delivery'),
  },
  {
    id: 'cosnole',
    label: 'Send Message',
    action: () => console.log('message!'),
  },
]

type Option = {
  id: string
  label: string
  action: () => void
}

type OptionAsObject = {
  [id: string]: Option
}

const optionObject = newOptions.reduce((acc, option) => {
  acc[option.id] = option
  return acc
}, {} as OptionAsObject)

const ITEM_HEIGHT = 48

type DotMenuProps = {
  options: Option[]
}

export default function DotMenu({ options }: DotMenuProps) {
  console.log('render options !')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (callback?: () => void) => () => {
    if (callback) {
      callback()
    }
    setAnchorEl(null)
  }

  const wrappedOptions = React.useMemo(
    () =>
      options.map((option) => ({
        ...option,
        action: handleClose(option.action),
      })),
    [options]
  )

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose()}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {wrappedOptions.map((option) => (
          <MenuItem
            key={option.id}
            // selected={option.label === 'Pyxis'}
            onClick={option.action}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
