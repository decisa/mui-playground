import { Button } from '@mui/material'
// import * as React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CheckBoxTree, { TNestedCheckbox } from '../Components/Form/CheckBoxTree'
import { reduceToLabels, sampleData } from '../Components/Form/sampleData'

const treeNode: yup.ObjectSchema<TNestedCheckbox> = yup.object().shape({
  id: yup.string().required(),
  checked: yup.boolean().required(),
  children: yup.array().of(yup.lazy(() => treeNode)),
})

const formSchema = yup.object().shape({
  officeLocations: yup
    .array()
    .of(treeNode)
    .test('not-empty', 'locations are missing', (value) => {
      console.log('location validation going on:', value)
      // return false
      const result = !!value
      console.log(`result is ${result.toString()}`)
      return !!value && value.length > 0
    })
    .test(
      'node-selected',
      'at least one location should be selected',
      (value) => {
        console.log('validation going on:', value)
        // return false
        const atLeastOneSelected = (array: TNestedCheckbox[]): boolean =>
          array.some(
            (node) =>
              node.checked ||
              (node.children && atLeastOneSelected(node.children))
          )
        if (!value) return false
        return atLeastOneSelected(value)
      }
    ),
})

// function atLeastOne

type TFormData = yup.InferType<typeof formSchema>

export default function MultiCheckboxPage() {
  const labels = reduceToLabels(sampleData, {})
  // const initCheckedState = getCheckedState(sampleData)

  const initCheckedState = [
    {
      children: [
        {
          id: 'L11',
          checked: false,
        },
        {
          id: 'L12',
          checked: false,
        },
        {
          id: 'L13',
          checked: false,
        },
      ],
      id: 'P1',
      checked: false,
    },
    {
      id: 'P7',
      checked: false,
    },
    {
      children: [
        {
          id: 'L21',
          checked: true,
        },
        {
          id: 'L22',
          checked: false,
        },
        {
          id: 'L23',
          checked: false,
        },
      ],
      id: 'P2',
      checked: false,
    },
    {
      children: [
        {
          id: 'L31',
          checked: false,
        },
        {
          id: 'L32',
          checked: false,
        },
        {
          id: 'L33',
          checked: false,
        },
      ],
      id: 'P3',
      checked: false,
    },
    {
      children: [],
      id: 'P4',
      checked: false,
    },
  ]

  const defaultFormValues: TFormData = {
    officeLocations: initCheckedState,
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    getValues,
  } = useForm<TFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const resetLocations = () =>
    resetField('officeLocations', { defaultValue: [] })

  const getLocations = () => {
    console.log('locations:', getValues().officeLocations)
  }

  if (Object.keys(errors).length > 0) {
    console.log('there are errors in form:')
    for (const [key, value] of Object.entries(errors)) {
      console.log(`${key}:`, value)
    }
  }

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
      <Button onClick={resetLocations} type="button" variant="outlined">
        Reset
      </Button>
      <Button onClick={getLocations} type="button" variant="outlined">
        Get Locations
      </Button>
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
