import { Box, SxProps } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { Product } from '../../Types/dbtypes'
import ProductName from './Blocks/ProductName'
import ProductOptions from './Blocks/ProductOptions'
import ProductThumbnail from './Blocks/ProductThumbnail'

type ProductCardVariant = 'imageSide' | 'imageBelow'
type ProductCardSize = 'compact' | 'full' | 'responsive'

type ProductCardProps = {
  product: Product
  image?: boolean
  sx?: SxProps
}

type ProductCardVariantProps = ProductCardProps & {
  variant?: ProductCardVariant
}

export default function ProductCard({
  product,
  image = true,
  sx,
  variant = 'imageSide',
}: ProductCardVariantProps) {
  switch (variant) {
    case 'imageSide':
      return <ProductCardImageSide product={product} image={image} />
    case 'imageBelow':
      return <ProductCardImageBelow product={product} image={image} sx={sx} />
    default:
      return <div>unknown</div>
  }
}

// todo: add compact, full, responsive

const ProductCardImageSide = ({ product, image, sx }: ProductCardProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: image
        ? {
            xs: '80px 1fr',
            sm: '150px 1fr',
          }
        : '1fr',
      ...sx,
    }}
  >
    {image && (
      <Box
        sx={{
          gridRowStart: {
            xs: 1,
            sm: 1,
          },
          gridRowEnd: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <ProductThumbnail
          product={product}
          sx={{
            my: 1,
          }}
        />
      </Box>
    )}

    <ProductName
      product={product}
      sx={
        image
          ? {
              display: {
                xs: 'flex',
                sm: 'block',
              },
              flexDirection: 'column',
              alignSelf: 'center',
              ml: 2,
            }
          : {
              ml: 0,
            }
      }
    />
    <Box
      sx={
        image
          ? {
              gridColumnStart: {
                xs: 1,
                sm: 2,
              },
              gridColumnEnd: {
                xs: 3,
                sm: 3,
              },
              ml: {
                xs: 0,
                sm: 2,
              },
            }
          : {
              ml: 0,
            }
      }
    >
      <ProductOptions options={product.configuration.options} />
    </Box>
  </Box>
)

// const ProductCardImageSide = ({ product, image, sx }: ProductCardProps) => (
//   <Box
//     sx={{
//       display: 'flex',
//       gap: 2,
//       flexDirection: {
//         xs: 'column',
//         sm: 'row',
//       },
//       ...sx,
//     }}
//   >
//     {image && <ProductThumbnail product={product} sx={{ my: 1 }} />}
//     <Box>
//       <ProductName product={product} />
//       <ProductOptions options={product.configuration.options} />
//     </Box>
//   </Box>
// )

const ProductCardImageBelow = ({ product, image, sx }: ProductCardProps) => (
  <Box
    sx={{
      display: 'flex',
      gap: 1,
      flexDirection: 'column',
      py: 1,
      ...sx,
    }}
  >
    <ProductName product={product} />
    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
        gap: 1,
      }}
    >
      {image ? (
        <ProductThumbnail
          product={product}
          sx={{
            // flex: 1
            flex: 1,
            order: {
              xs: 1,
              sm: 0,
            },
            ml: { xs: 2.5, sm: 0 },
            // mt: { xs: 1, sm: 0 },
          }}
        />
      ) : null}
      <ProductOptions
        options={product.configuration.options}
        sx={{
          py: 0,
          flex: 3,
          order: {
            xs: 0,
            sm: 1,
          },
        }}
      />
    </Box>
  </Box>
)
