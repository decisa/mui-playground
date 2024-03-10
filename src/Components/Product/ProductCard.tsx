import { Box, SxProps } from '@mui/material'

import { Product } from '../../Types/dbtypes'
import ProductName from './Blocks/ProductName'
import ProductOptions from './Blocks/ProductOptions'
import ProductThumbnail from './Blocks/ProductThumbnail'

export type ProductCardVariant = 'imageSide' | 'imageBelow'
export type ProductCardSize = 'compact' | 'full' | 'responsive'

const defaultSize: ProductCardSize = 'responsive'
const defaultVariant: ProductCardVariant = 'imageBelow'

type ProductCardProps = {
  product: Product
  image?: boolean
  sx?: SxProps
  size?: ProductCardSize
}

type ProductCardVariantProps = ProductCardProps & {
  variant?: ProductCardVariant
}

export default function ProductCard({
  product,
  image = true,
  sx,
  variant = defaultVariant,
  size = defaultSize,
}: ProductCardVariantProps) {
  switch (variant) {
    case 'imageSide':
      return (
        <ProductCardImageSide
          product={product}
          image={image}
          sx={sx}
          size={size}
        />
      )
    case 'imageBelow':
      return (
        <ProductCardImageBelow
          product={product}
          image={image}
          sx={sx}
          size={size}
        />
      )
    default:
      return <div>unknown</div>
  }
}

// todo: add compact, full, responsive

function getSideImageStyles({
  image,
  sx,
  size = defaultSize,
}: Omit<ProductCardProps, 'product'>) {
  type SizeStyles = Record<ProductCardSize, SxProps> & { common?: SxProps }
  const container: SizeStyles = {
    compact: {
      gridTemplateColumns: image ? '80px 1fr' : '1fr',
    },
    full: {
      gridTemplateColumns: image ? '150px 1fr' : '1fr',
    },
    responsive: {
      gridTemplateColumns: image
        ? {
            xs: '80px 1fr',
            sm: '150px 1fr',
          }
        : '1fr',
    },
    common: {
      display: 'grid',
      ...sx,
    },
  }

  const thumbnail: SizeStyles = {
    compact: {
      gridRowStart: 1,
      gridRowEnd: 2,
    },
    full: {
      gridRowStart: 1,
      gridRowEnd: 3,
    },
    responsive: {
      gridRowStart: {
        xs: 1,
        sm: 1,
      },
      gridRowEnd: {
        xs: 2,
        sm: 3,
      },
    },
  }

  const productName: SizeStyles = {
    compact: image
      ? {
          display: 'flex',
          flexDirection: 'column',
        }
      : {},
    full: {},
    responsive: image
      ? {
          display: {
            xs: 'flex',
            sm: 'block',
          },
          flexDirection: 'column',
        }
      : {},
    common: image
      ? {
          // alignSelf: 'center',
          ml: 2,
          // pt: 0.5,
        }
      : {
          ml: 0,
        },
  }

  const productOptions: SizeStyles = {
    compact: image
      ? {
          gridColumnStart: 1,
          gridColumnEnd: 3,
          ml: 0,
          '& .MuiListItem-root': {
            pl: 0,
          },
        }
      : {},
    full: image
      ? {
          gridColumnStart: 2,
          gridColumnEnd: 3,
          ml: 2,
        }
      : {},
    responsive: image
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
          '& .MuiListItem-root': {
            pl: {
              xs: 0,
              sm: 2,
            },
          },
        }
      : {},
    common: image ? {} : { ml: 0 },
  }

  return {
    container: {
      ...container[size],
      ...container.common,
    },
    thumbnail: {
      ...thumbnail[size],
      ...thumbnail.common,
    },
    productName: {
      ...productName[size],
      ...productName.common,
    },
    productOptions: {
      ...productOptions[size],
      ...productOptions.common,
    },
  }
}

const ProductCardImageSide = ({
  product,
  image,
  sx,
  size = defaultSize,
}: ProductCardProps) => {
  const styles = getSideImageStyles({ image, sx, size })

  return (
    <Box sx={styles.container}>
      {image && (
        <Box sx={styles.thumbnail}>
          <ProductThumbnail
            product={product}
            // sx={{
            //   my: 1,
            // }}
          />
        </Box>
      )}

      <ProductName product={product} sx={styles.productName} />
      <Box sx={styles.productOptions}>
        <ProductOptions options={product.configuration.options} />
      </Box>
    </Box>
  )
}

function getImageBelowStyles({
  image,
  sx,
  size = defaultSize,
}: Omit<ProductCardProps, 'product'>) {
  type SizeStyles = Record<ProductCardSize, SxProps> & { common?: SxProps }
  const mainContainer: SizeStyles = {
    compact: {},
    full: {},
    responsive: {},
    common: {
      display: 'flex',
      gap: 1,
      flexDirection: 'column',
      // py: 1,
      ...sx,
    },
  }

  const innerContainer: SizeStyles = {
    compact: {
      flexDirection: 'column',
    },
    full: {
      flexDirection: 'row',
    },
    responsive: {
      flexDirection: {
        xs: 'column',
        sm: 'row',
      },
    },
    common: {
      display: 'flex',
      gap: 1,
    },
  }

  const thumbnail: SizeStyles = {
    compact: {
      order: 1,
      ml: 2.5,
    },
    full: {
      order: 0,
      ml: 0,
    },
    responsive: {
      order: {
        xs: 1,
        sm: 0,
      },
      ml: {
        xs: 2.5,
        sm: 0,
      },
    },
    common: {
      flex: 1,
    },
  }

  const productOptions: SizeStyles = {
    compact: {
      order: 0,
    },
    full: {
      order: 1,
    },
    responsive: {
      order: {
        xs: 0,
        sm: 1,
      },
    },
    common: {
      py: 0,
      flex: 3,
    },
  }

  return {
    mainContainer: {
      ...mainContainer[size],
      ...mainContainer.common,
    },
    innerContainer: {
      ...innerContainer[size],
      ...innerContainer.common,
    },
    thumbnail: {
      ...thumbnail[size],
      ...thumbnail.common,
    },
    productOptions: {
      ...productOptions[size],
      ...productOptions.common,
    },
  }
}

const ProductCardImageBelow = ({
  product,
  image,
  sx,
  size = defaultSize,
}: ProductCardProps) => {
  const styles = getImageBelowStyles({ image, sx, size })

  return (
    <Box sx={styles.mainContainer}>
      <ProductName product={product} />
      <Box sx={styles.innerContainer}>
        {image ? (
          <ProductThumbnail product={product} sx={styles.thumbnail} />
        ) : null}
        <ProductOptions
          options={product.configuration.options}
          sx={styles.productOptions}
        />
      </Box>
    </Box>
  )
}
