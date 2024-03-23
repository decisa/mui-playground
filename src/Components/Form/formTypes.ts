import { TextFieldProps } from '@mui/material'
import {
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'

export type KeyTypeConstraint<T, RequiredType> = {
  [K in keyof T]: T[K] extends RequiredType ? K : never
}[keyof T]

type RegisterTextFieldProps<TForm extends FieldValues> = {
  name: FieldPath<TForm>
  register: UseFormRegister<TForm>
  size?: 'small' | 'medium'
  required?: boolean
  variant?: 'outlined' | 'standard' | 'filled'
  autoComplete?: string
  fullWidth?: boolean
  errors?: FieldErrors<TForm>
}

export function registerTextField<TForm extends FieldValues>({
  name,
  size = 'small',
  required = false,
  variant = 'outlined',
  autoComplete,
  fullWidth = true,
  register,
  errors,
}: RegisterTextFieldProps<TForm>): TextFieldProps {
  return {
    ...register(name),
    error: errors ? !!errors[name] : undefined,
    autoComplete: autoComplete || name,
    helperText: errors ? (errors[name]?.message as string) : undefined,
    size,
    required,
    variant,
    fullWidth,
   
  } satisfies TextFieldProps
}
