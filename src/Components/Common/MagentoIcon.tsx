import { SvgIcon } from '@mui/material'
import { ReactComponent as MagentoIconSvg } from './assets/magento.svg'

const MagentoIcon = () => (
  <SvgIcon
    component={MagentoIconSvg}
    viewBox="0 0 24 24"
    fontSize="small"
    sx={{
      color: '#cd2027',
      verticalAlign: 'middle',
      width: '0.7em',
      height: '0.7em',
      marginRight: 1,
      marginBottom: 0.25,
    }}
  />
)

export default MagentoIcon
