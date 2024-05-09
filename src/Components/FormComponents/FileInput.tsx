import { Box, Button, IconButton, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useCallback, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import ProductThumbnail from '../Product/Blocks/ProductThumbnail'

const whiteRectangle =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABQCAQAAABRuUTAAAAAg0lEQVR42u3QAQEAAAgCoPw/2i44ACaQ9hhFlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsmTJkiVLlixZsnYPWxOfsVUNN/sAAAAASUVORK5CYII='

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

type FileInputProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  label: string
}

export default function FileInput<TForm extends FieldValues>({
  control,
  name,
  label,
}: FileInputProps<TForm>) {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  // const [image, setImage] = useState<string>(whiteRectangle)

  const [isDragging, setIsDragging] = useState(false)
  const convertToBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })

  const processFileDrop = useCallback(
    async (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!e?.dataTransfer?.files) return
      const file = e.dataTransfer.files[0] as Blob
      const base64 = await convertToBase64(file)
      // setImage(base64 as string)
      onChange(base64 as string)
      console.log('image:', base64)
      setIsDragging(false)
    },
    [onChange]
  )

  const startDrag = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  const endDrag = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const resetFileInput = useCallback(() => {
    onChange(null)
  }, [onChange])

  const hasImage = value && value !== whiteRectangle

  return (
    <Box
      // variant="contained"
      // color={isDragging ? 'secondary' : 'primary'}

      // startIcon={<CloudUploadIcon />}
      // onDragEnter={startDrag}
      // onDragLeave={endDrag}
      // onDragOver={disableDefaults}
      // onDrop={processFileDrop}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ProductThumbnail
          src={value || whiteRectangle}
          alt="file to upload"
          borderColor="#ccc"
          sx={{ width: 150 }}
        />

        {hasImage && (
          <IconButton
            aria-label="delete image"
            color="error"
            onClick={resetFileInput}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        )}
      </Box>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        color={isDragging ? 'secondary' : 'primary'}
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onDragEnter={startDrag}
        onDragLeave={endDrag}
        // onDragOver={disableDefaults}
        onDrop={processFileDrop}
        sx={{ width: 150 }}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          onChange={async (e) => {
            // fixme: check if this handler is needed or requires a fix to work with the form
            if (!e?.target?.files) return
            const file = e.target.files[0] as Blob
            const base64 = await convertToBase64(file)
            setImage(base64 as string)
            console.log('image:', base64)
          }}
        />
      </Button>
    </Box>
  )
}
