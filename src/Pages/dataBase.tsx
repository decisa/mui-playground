import { Button, darken } from '@mui/material'
import { useForm } from 'react-hook-form'
import type { DefaultValues } from 'react-hook-form'
import FormCheckBoxDataTable from '../Components/FormComponents/FormCheckBoxDataTable'
import type { THead } from '../Components/FormComponents/FormCheckBoxDataTable'

type TTableData = {
  calories: number
  fat: number
  name: string
  value: string
}

function createData(
  name: string,
  calories: number,
  fat: number,
  value: string
): TTableData {
  return {
    name,
    calories,
    fat,
    value,
  }
}

export default function DatabasePage() {
  const data = [
    createData('Appointment with long name', 305, 3.7, 'awln'),
    createData('Short Appointment', 452, 25.0, 'sa'),
    createData('Surgery', 262, 16.0, 's'),
    createData('Sick visit', 159, 6.0, 'sv'),
    createData('Tooth removing', 356, 16.0, 'tr'),
    createData('Long Appointment', 408, 3.2, 'la'),
    createData('Telemedicine', 237, 9.0, 'tm'),
    createData('Just to see doctor from the street', 375, 0.0, 'jtsdfts'),
    createData('Just an regular checkup ', 518, 26.0, 'jarc'),
    createData('Appointment without solution', 392, 0.2, 'aws'),
    createData('Marshmallow Appointment', 318, 0, 'ma'),
    createData('No appointment type', 360, 19.0, 'nat'),
    createData('Oreo Appointment', 437, 18.0, 'oa'),
  ]

  const headCells: THead<TTableData>[] = [
    {
      accessor: 'name',
      align: 'left',
      label: 'Appointment Type(s)',
      useAsAriaDescription: true,
      sortEnabled: true,
    },
    {
      accessor: 'calories',
      label: 'Calories',
      align: 'right',
      // useAsAriaDescription: true,
    },
    {
      accessor: 'fat',
      label: 'Fat (g)',
      // sortEnabled: true,
      align: 'right',
    },
  ]

  type TFormData = {
    apptTypes: string[]
    firstName?: string
  }

  const defaultValues: DefaultValues<TFormData> = {
    apptTypes: ['om', 'aws', 'sv'],
  }

  const { control, handleSubmit } = useForm<TFormData>({
    defaultValues,
  })

  const onSubmit = (formData: TFormData) => {
    console.dir(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCheckBoxDataTable
        columns={headCells}
        data={data}
        tableContainerHeight={333}
        control={control}
        name="apptTypes"
        // isPaginated
      />
      <Button
        type="submit"
        sx={{
          width: 130,
          textTransform: 'none',
          color: 'white',
          backgroundColor: '#00749f',
          '&:hover': {
            backgroundColor: darken('#00749f', 0.3),
          },
        }}
      >
        Submit Form
      </Button>
    </form>
  )
}
