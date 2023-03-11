import { Button, darken } from '@mui/material'
import { FieldValues, useForm } from 'react-hook-form'
import FormCheckBoxDataTable, {
  Head,
} from '../Components/Form/FormCheckBoxDataTable'

type FormData = {
  ['apptTypes']: string[]
}

export default function DatabasePage() {
  interface Data {
    calories: number
    fat: number
    name: string
    value: string
  }

  // let value = 12
  function createData(
    name: string,
    calories: number,
    fat: number,
    value: string
  ): Data {
    return {
      name,
      calories,
      fat,
      value,
      // eslint-disable-next-line no-plusplus
      // value: (value++).toString(),
    }
  }

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

  const headCells: Head<Data>[] = [
    {
      accessor: 'name',
      align: 'left',
      label: 'Appointment Type(s)',
      // primary: true,
    },
    {
      accessor: 'calories',
      label: 'Calories',
      align: 'right',
      primary: true,
    },
    {
      accessor: 'fat',
      label: 'Fat (g)',
    },
  ]

  const defaultValues: FieldValues = {
    apptTypes: ['om', 'aws', 'sv'],
  }

  const { control, handleSubmit } = useForm({ defaultValues })

  const onSubmit = (formData: FieldValues) => {
    console.dir(formData)
  }

  console.log('rendering database page')
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCheckBoxDataTable<Data>
        isPaginated
        tableContainerHeight={300}
        columns={headCells}
        data={data}
        // selected={['jtsdfts', 'aws', 'oa']}
        control={control}
        name="apptTypes"
      />
      <Button
        type="submit"
        sx={{
          borderRadius: 2,
          mb: 5,
          mr: 15,
          fontSize: 20,
          lineHeight: 2,
          width: 100,
          color: 'white',
          backgroundColor: '#00749f',
          '&:hover': {
            backgroundColor: darken('#00749f', 0.3),
          },
        }}
      >
        {' '}
        Save{' '}
      </Button>
    </form>
  )
}
