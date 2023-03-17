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

function parseLocation(locationData) {
  const { locationId, locationName, enabled } = locationData

  return {
    label: locationName,
    value: locationId,
    checked: enabled,
  }
}

function parsePractice(practiceData) {
  const { practiceId, practiceName, allLocations, locations } = practiceData

  const parsedPracticeRecord = {
    label: practiceName,
    value: practiceId,
    checked: allLocations,
  }

  if (locations) {
    parsedPracticeRecord.children = locations.map(parseLocation)
  }

  return parsedPracticeRecord
}

function parsePracticeLocations(practiceLocationsData = []) {
  return practiceLocationsData.map(parsePractice)
}

console.dir(parsePracticeLocations(sampleGraphQLData.input.practiceLocations), {
  depth: null,
})
