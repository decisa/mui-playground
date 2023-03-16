import PeopleIcon from '@mui/icons-material/People'
import ImageIcon from '@mui/icons-material/Image'
import PublicIcon from '@mui/icons-material/Public'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import DnsIcon from '@mui/icons-material/Dns'

export const mainNavbarItems = [
  {
    id: 0,
    label: 'Authentication',
    path: 'signin',
    icon: <PeopleIcon />,
  },
  {
    id: 1,
    label: 'Database',
    path: 'database',
    icon: <ImageIcon />,
  },
  {
    id: 2,
    label: 'Customer 1',
    path: 'customer/1',
    icon: <PublicIcon />,
  },
  {
    id: 3,
    label: 'Customer 3',
    path: 'customer/3',
    icon: <SettingsEthernetIcon />,
  },
  {
    id: 4,
    label: 'Functions',
    path: 'order/15',
    icon: <SettingsInputComponentIcon />,
  },
  {
    id: 5,
    label: 'Machine-Learning',
    path: 'signin',
    icon: <DnsIcon />,
  },
  {
    id: 6,
    label: 'All Customers',
    path: 'customer',
    icon: <DnsIcon />,
  },
  {
    id: 7,
    label: 'Orders',
    path: 'order',
    icon: <DnsIcon />,
  },
  {
    id: 8,
    label: 'Multi Checkbox',
    path: 'multicheckbox',
    icon: <DnsIcon />,
  },
]
