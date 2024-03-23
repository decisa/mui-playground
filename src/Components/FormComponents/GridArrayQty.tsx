import { ArrayPath, Control, FieldPath, FieldValues } from 'react-hook-form'
import NumberInput from './NumberInput'

type GridArrayQtyProps<FormData extends FieldValues> = {
  control: Control<FormData>
  name: ArrayPath<FormData>
  min?: number
  max?: number
  step?: number
  index: number
  fieldName: string
}

const GridArrayQty = <FormData extends FieldValues>({
  control,
  name,
  index,
  fieldName,
  ...inputNumberProps
}: GridArrayQtyProps<FormData>) => (
  <NumberInput
    control={control}
    name={`${name}.${index}.${fieldName}` as FieldPath<FormData>}
    {...inputNumberProps}
  />
)

export default GridArrayQty
