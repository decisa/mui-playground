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

  // CheckBoxTree needs "lables" object in the format:
  // {
  //   office1_ID: office1_Name,
  //   office2_ID: office2_Name,
  //   office3_ID: office3_Name,
  //   ...
  // }
  //
  // what will be displayed and selected (initial state) is passed through form or defaultValues field
  // the object is a tree. Every node is of type TNestedCheckbox which can be imported from module with component
  // format of the data:
  // [
  //   {
  //     id: '1956',
  //     checked: false,
  //     children: [
  //       {
  //         id: '4021',
  //         checked: false,
  //       },
  //       {
  //         id: '3036',
  //         checked: true,
  //       },
  //     ],
  //   },
  //   {
  //     id: '1492',
  //     checked: true,
  //   },
  //   {
  //     id: '3610',
  //     checked: true,
  //     children: [ ... ],
  //   }
  // ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CheckBoxTree
        labels={labels}
        // defaultValues={initCheckedState}
        sx={{ p: 0, fontSize: 14 }}
        control={control}
        name="officeLocations"
        caption="Please choose dental office locations:"
        // maxHeight={350}
      />
      <Button type="submit">submit</Button>
    </form>
  )
}
