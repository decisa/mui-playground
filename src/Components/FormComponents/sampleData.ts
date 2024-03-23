import type { TNestedCheckbox } from './CheckBoxTree'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleGraphQLData = {
  input: {
    enabled: false,
    workflow: 'CONFIRMATION',
    allAppointmentTypes: true,
    allPracticeLocations: true,
    allStaff: true,
    startDateUTC: '2023-03-01T00:00:00.000Z',
    templates: {
      confirmation: {
        sms: {
          english: 'english sms template',
          spanish: 'spanish sms template',
        },
        email: {
          english: 'english email template',
          spanish: 'spanish email template',
        },
        voice: {
          english: 'english voice template',
          spanish: 'spanish voice template',
        },
      },
    },
    appointmentTypes: [],
    practiceLocations: [
      {
        practiceId: 121,
        practiceName:
          'National Dental Association Of Extremely Qualified Doctors with Best Customer Service',
        allLocations: false,
        locations: [
          {
            locationId: 24451,
            locationName: 'Nothern Office of Chicago',
            enabled: true,
          },
          {
            locationId: 31234,
            locationName: 'Southern Office of Miami',
            enabled: false,
          },
          {
            locationId: 23742,
            locationName: 'Eastern Office of New York',
            enabled: false,
          },
        ],
      },
      {
        practiceId: 57,
        practiceName: 'BrightSmile Innovations',
        allLocations: true,
        locations: [
          {
            locationId: 89451,
            locationName: 'Oceanview Family Dentistry',
            enabled: true,
          },
          {
            locationId: 69234,
            locationName: 'Parkside Dental Clinic',
            enabled: true,
          },
          {
            locationId: 23230,
            locationName: 'Highpoint Dental Pavilion',
            enabled: true,
          },
        ],
      },
    ],
    staff: [],
  },
}

// function parseLocation(locationData) {
//   const { locationId, locationName, enabled } = locationData

//   return {
//     label: locationName,
//     value: locationId,
//     checked: enabled,
//   }
// }

// function parsePractice(practiceData) {
//   const { practiceId, practiceName, allLocations, locations } = practiceData

//   const parsedPracticeRecord = {
//     label: practiceName,
//     value: practiceId,
//     checked: allLocations,
//   }

//   if (locations) {
//     parsedPracticeRecord.children = locations.map(parseLocation)
//   }

//   return parsedPracticeRecord
// }

// function parsePracticeLocations(practiceLocationsData = []) {
//   return practiceLocationsData.map(parsePractice)
// }

// console.dir(parsePracticeLocations(sampleGraphQLData.input.practiceLocations), {
//   depth: null,
// })

type TNestedCheckboxData = {
  id: string
  label: string
  checked: boolean
  children?: TNestedCheckboxData[]
}

export const sampleData: TNestedCheckboxData[] = [
  {
    id: '9573',
    label:
      'National Dental Association Of Extremely Qualified Doctors with Outstanding Customer Service',
    // label: '',
    checked: false,
    children: [
      {
        id: '7281',
        label: 'Sunset Smiles Dental',
        checked: true,
      },
      {
        id: '6419',
        label: 'Beverly Hills Dental Group',
        checked: true,
      },
      {
        id: '2465',
        label: 'North Hollywood Family Dental',
        checked: false,
      },
      {
        id: '8759',
        label: 'Inglewood Dental Center',
        checked: true,
      },
    ],
  },

  {
    id: '1956',
    label: 'Long Beach Dental Group',
    checked: false,
    children: [
      {
        id: '4021',
        label: 'Sherman Oaks Dental Care',
        checked: false,
      },
      {
        id: '3036',
        label: 'Pasadena Smile Center',
        checked: true,
      },
      {
        id: '5108',
        label: 'South Bay Dental',
        checked: false,
      },
    ],
  },

  {
    id: '1492',
    label: 'West LA Dental Office',
    checked: true,
  },
  {
    id: '3610',
    label: 'Glendale Family Dentistry',
    checked: true,
    children: [
      {
        id: '6789',
        label: 'Marina Del Rey Dental Center',
        checked: true,
      },
      {
        id: '9376',
        // label: 'Century City Dental Group',
        label: '',
        checked: true,
        children: [
          {
            id: '8240',
            label: 'Culver City Dental Associates',
            checked: true,
          },
          {
            id: '4815',
            label: 'West Hollywood Dental Care',
            checked: true,
          },
        ],
      },
    ],
  },
]

export function reduceToLabels(
  nestedData: TNestedCheckboxData[],
  destinationObject: { [key: string]: string }
) {
  nestedData.forEach(({ id, label, children }) => {
    destinationObject[id] = label
    if (children) {
      reduceToLabels(children, destinationObject)
    }
  })
  return destinationObject
}

export function getCheckedState<T extends TNestedCheckbox>(
  data: T[]
): TNestedCheckbox[] {
  if (!data.length) {
    return []
  }
  const extract = <U extends TNestedCheckbox>(
    dataLevel: U[]
  ): TNestedCheckbox[] => {
    if (!dataLevel.length) {
      return []
    }
    return dataLevel.map((dataElement) => {
      const { checked, id, children } = dataElement

      return children
        ? {
            checked,
            id,
            children: extract(children),
          }
        : {
            checked,
            id,
          }
    })
  }
  return extract(data)
}
