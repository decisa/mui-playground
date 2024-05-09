import { Box, SxProps } from '@mui/material'
import { ProductCreate } from '../../../Types/dbtypes'
import { cacheFolder, domain } from '../../../Magento/magentoAuthorize'

type ThumbnailProps =
  | {
      product: Pick<ProductCreate, 'image' | 'name'>
      sx?: SxProps
      src?: undefined
      alt?: undefined
      borderColor?: string
    }
  | {
      // option to use a different src, not just product record
      product?: undefined
      sx?: SxProps
      src: string
      alt?: string
      borderColor?: string
    }

const ProductThumbnail = ({
  product,
  sx,
  src,
  alt,
  borderColor,
}: ThumbnailProps) => {
  const { image, name } = product || {}
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
        overflow: 'clip',
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        ...sx,
        // mb: 'auto',
      }}
    >
      <img
        src={src || url}
        alt={alt || name}
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
