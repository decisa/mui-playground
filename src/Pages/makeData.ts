/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker'

export type Person = {
  userId: string
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i += 1) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => ({
  userId: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number(40),
  visits: faker.datatype.number(1000),
  progress: faker.datatype.number(100),
  status: faker.helpers.shuffle<Person['status']>([
    'relationship',
    'complicated',
    'single',
  ])[0]!,
})

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map(
      (d): Person => ({
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      })
    )
  }

  return makeDataLevel()
}
