import { Box, SxProps } from '@mui/material'
import { Product } from '../../../Types/dbtypes'
import { cacheFolder, domain } from '../../../Magento/magentoAuthorize'

type ThumbnailProps = {
  product: Product
  sx?: SxProps
}

const ProductThumbnail = ({ product, sx }: ThumbnailProps) => {
  const { image, name } = product
  const url = `${domain}${cacheFolder}/${image || 'noimage.jpg'}`
  // <Avatar src={image} variant="rounded" sx={{ width: 130 }} />
  return (
    <Box
      sx={{
        width: 1,
        maxWidth: 150,
        minWidth: 80,
        aspectRatio: '3/2',
        position: 'relative',
        ...sx,
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
          // height: '100%',
          objectFit: 'cover', // This will ensure the image scales correctly
          borderRadius: '3px',
        }}
      />
    </Box>
  )
}

export default ProductThumbnail
