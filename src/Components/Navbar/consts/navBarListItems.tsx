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
    label: 'Storage',
    path: 'storage',
    icon: <PublicIcon />,
  },
  {
    id: 3,
    label: 'Hosting',
    path: 'hosting',
    icon: <SettingsEthernetIcon />,
  },
  {
    id: 4,
    label: 'Functions',
    path: 'functions',
    icon: <SettingsInputComponentIcon />,
  },
  {
    id: 5,
    label: 'Machine-Learning',
    path: 'signin',
    icon: <DnsIcon />,
  },
]
