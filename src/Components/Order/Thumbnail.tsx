import { Box } from '@mui/material'
import { Product } from '../../Types/dbtypes'

const domain = process.env.REACT_APP_MAGENTO_DOMAIN || ''
const cacheFolder = process.env.REACT_APP_MAGENTO_IMAGE_CACHE || ''

type ThumbnailProps = {
  product: Product
}

const Thumbnail = ({ product }: ThumbnailProps) => {
  const { image, name } = product
  const url = `${domain}${cacheFolder}/${image || 'noimage.jpg'}`
  // <Avatar src={image} variant="rounded" sx={{ width: 130 }} />
  return (
    <Box
      sx={{
        width: 1,
        maxWidth: 150,
        minWidth: 120,
        aspectRatio: '3/2',
        position: 'relative',
        // mb: 'auto',
      }}
    >
      <img
        src={url}
        alt={name}
        style={{
          position: 'absolute', // Needed to fill the Box
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover', // This will ensure the image scales correctly
          borderRadius: '3px',
        }}
      />
    </Box>
  )
}

export default Thumbnail
