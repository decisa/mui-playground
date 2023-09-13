import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

type Option = {
  id: string
  label: string
  action: () => void
}

type DotMenuProps = {
  options: Option[]
}

export default function DotMenu({ options }: DotMenuProps) {
  // console.log('render options !')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleClick', event.currentTarget)
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
            {option.label} xxx
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
