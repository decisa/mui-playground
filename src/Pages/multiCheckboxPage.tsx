import { Button } from '@mui/material'
// import * as React from 'react'
import { useForm } from 'react-hook-form'

import CheckBoxTree, { TNestedCheckbox } from '../Components/Form/CheckBoxTree'
import {
  getCheckedState,
  reduceToLabels,
  sampleData,
} from '../Components/Form/sampleData'

type TFormData = {
  officeLocations: TNestedCheckbox[]
}

export default function MultiCheckboxPage() {
  const labels = reduceToLabels(sampleData, {})
  const initCheckedState = getCheckedState(sampleData)

  const defaultFormValues: TFormData = {
    officeLocations: initCheckedState,
  }

  const { control, handleSubmit } = useForm<TFormData>({
    defaultValues: defaultFormValues,
  })

  const onSubmit = (formData: TFormData): void => {
    console.dir(JSON.stringify(formData.officeLocations, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CheckBoxTree
        labels={labels}
        defaultValues={initCheckedState}
        sx={{ p: 0 }}
        control={control}
        name="officeLocations"
        // maxHeight={350}
      />
      <Button type="submit">submit</Button>
    </form>
  )
}
