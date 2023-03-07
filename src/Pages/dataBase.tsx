import { match, P, Pattern } from 'ts-pattern'

interface User {
  firstName: string
  lastName: string
  age: number
}

interface AdminUser extends User {
  tellSecret(): void
}

type Input = User | AdminUser

export default function DatabasePage() {
  const someUser = {
    firstName: 'Art',
    lastName: 'Telesh',
    age: 39,
    tellSecret: () => console.log('this is secret'),
  } as Input

  const output = match(someUser)
    // .with({tellSecret: string} , ({firstName, lastName, tellSecret}) => `${firstName} ${lastName} - ${tellSecret()}`))
    .with(
      { tellSecret: P.when((tellSecret) => typeof tellSecret === 'function') },
      () => `this is Artemka admin`
    )
    // .with({firstName: string, lastName: string}, ({firstName, lastName}) => `${firstName} ${lastName}`) )
    .otherwise(() => 'unknown')
  return <div>database: {output}</div>
}
