import PeopleIcon from '@mui/icons-material/People'
import ImageIcon from '@mui/icons-material/Image'
import PublicIcon from '@mui/icons-material/Public'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import SailingIcon from '@mui/icons-material/Sailing'
import DnsIcon from '@mui/icons-material/Dns'
import SearchIcon from '@mui/icons-material/Search'
import SavedSearchIcon from '@mui/icons-material/SavedSearch'
import GradingIcon from '@mui/icons-material/Grading'
import BugReportIcon from '@mui/icons-material/BugReport'

export const mainNavbarItems = [
  {
    id: 1,
    label: 'Search Magento Order',
    path: 'magento',
    icon: <SearchIcon />,
  },
  // {
  //   id: 2,
  //   label: 'Orders Table',
  //   path: 'orders/table',
  //   icon: <SavedSearchIcon />,
  // },
  {
    id: 6,
    label: 'Orders Grid',
    path: 'orders',
    icon: <SavedSearchIcon />,
  },
  {
    id: 3,
    label: 'PurchaseOrders',
    path: 'po',
    icon: <GradingIcon />,
  },
  {
    id: 4,
    label: 'All Customers',
    path: 'customer',
    icon: <PublicIcon />,
  },
  {
    id: 5,
    label: 'Containers',
    path: 'containers',
    icon: <SailingIcon />,
  },
  {
    id: 7,
    label: 'Testing',
    path: 'testing',
    icon: <BugReportIcon />,
  },
  {
    id: 8,
    label: 'Planning',
    path: '/deliveries/planning',
    icon: <BugReportIcon />,
  },
  {
    id: 15,
    label: 'Map',
    path: 'map',
    icon: <PeopleIcon />,
  },
  // {
  //   id: 11,
  //   label: 'Database',
  //   path: 'database',
  //   icon: <ImageIcon />,
  // },

  // {
  //   id: 14,
  //   label: 'Functions',
  //   path: 'order/15',
  //   icon: <SettingsInputComponentIcon />,
  // },
  // {
  //   id: 15,
  //   label: 'Machine-Learning',
  //   path: 'signin',
  //   icon: <DnsIcon />,
  // },
  // {
  //   id: 18,
  //   label: 'Multi Checkbox',
  //   path: 'multicheckbox',
  //   icon: <DnsIcon />,
  // },
]
