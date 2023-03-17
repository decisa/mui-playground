/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// noinspection TypeScriptValidateTypes

// @ts-nocheck

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Paper from '@mui/material/Paper'

const ANIMALS = [
  {
    name: 'Farm',
    children: [{ name: 'Chicken' }, { name: 'Cow' }, { name: 'Sheep' }],
  },
  {
    name: 'Domestic',
    children: [{ name: 'Dog' }, { name: 'Cat' }],
  },
]

function NestedCheckboxTable() {
  const { control, handleSubmit, getValues, setValue } = useForm()
  const [expandedAnimals, setExpandedAnimals] = useState([])

  const handleSelectAll = (checked: boolean) => {
    console.log('clicked All')
    ANIMALS.forEach((animal) => {
      setValue(animal.name, checked)
      animal.children.forEach((child) => {
        setValue(`${animal.name}.${child.name}`, checked)
      })
    })
  }

  const handleExpandAnimal = (animalName: any) => {
    setExpandedAnimals((prevExpanded) =>
      prevExpanded.includes(animalName)
        ? prevExpanded.filter((name) => name !== animalName)
        : [...prevExpanded, animalName]
    )
  }

  const isAnimalExpanded = (animalName: any) =>
    expandedAnimals.includes(animalName)

  const isAnimalChecked = (animalName: string) =>
    ANIMALS.find((animal) => animal.name === animalName).children.every(
      (child) => getValues()[`${animalName}.${child.name}`]
    )

  const handleCheckAnimal = (event: {
    target: { name?: any; checked?: any }
  }) => {
    console.log('check animal')
    const animalName = event.target.name
    const { checked } = event.target

    setValue(animalName, checked)
    ANIMALS.find((animal) => animal.name === animalName).children.forEach(
      (child) => {
        setValue(`${animalName}.${child.name}`, checked)
      }
    )
  }

  const handleCheckChild = (event: {
    target: { name?: any; checked?: any }
  }) => {
    const [animalName, childName] = event.target.name.split('.')
    const { checked } = event.target

    setValue(`${animalName}.${childName}`, checked)

    // Check/uncheck the parent animal checkbox based on the child checkboxes
    const isAnimalFullyChecked = ANIMALS.find(
      (animal) => animal.name === animalName
    ).children.every((child) => getValues()[`${animalName}.${child.name}`])

    setValue(animalName, isAnimalFullyChecked)
  }

  const renderChildren = (animalName: string) => (
    <TableBody>
      {ANIMALS.find((animal) => animal.name === animalName).children.map(
        (child) => (
          <TableRow key={child.name}>
            <TableCell padding="checkbox">
              <Checkbox
                name={`${animalName}.${child.name}`}
                checked={getValues()[`${animalName}.${child.name}`]}
                onChange={handleCheckChild}
              />
            </TableCell>
            <TableCell>{child.name}</TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  )

  const renderAnimals = (animals: any[], level = 0) => (
    <>
      {animals.map(
        (animal: {
          name:
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | React.ReactFragment
            | React.Key
            | null
            | undefined
          children: any[]
        }) => {
          const animalRow = (
            <TableRow key={animal.name}>
              <TableCell
                padding="checkbox"
                style={{ paddingLeft: `${level * 16}px` }}
              >
                <Checkbox
                  name={animal.name}
                  checked={isAnimalChecked(animal.name)}
                  indeterminate={
                    !isAnimalChecked(animal.name) &&
                    ANIMALS.find((a) => a.name === animal.name).children.some(
                      (child) => getValues()[`${animal.name}.${child.name}`]
                    )
                  }
                  onChange={handleCheckAnimal}
                />
              </TableCell>
              <TableCell>{animal.name}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleExpandAnimal(animal.name)}
                  style={{ minWidth: 'unset' }}
                >
                  {isAnimalExpanded(animal.name) ? '-' : '+'}
                </Button>
              </TableCell>
            </TableRow>
          )

          const childRows = animal.children.map((child: any) => (
            <TableRow key={child.name}>
              <TableCell
                padding="checkbox"
                style={{ paddingLeft: `${(level + 1) * 40}px` }}
              >
                <Checkbox
                  name={`${animal.name}.${child.name}`}
                  checked={getValues()[`${animal.name}.${child.name}`]}
                  onChange={handleCheckChild}
                />
              </TableCell>
              <TableCell>{child.name}</TableCell>
            </TableRow>
          ))

          return (
            <>
              {animalRow}
              {isAnimalExpanded(animal.name) && childRows}
            </>
          )
        }
      )}
    </>
  )

  return (
    <div>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    ANIMALS.some((animal) =>
                      animal.children.some(
                        (child) => getValues[`${animal.name}.${child.name}`]
                      )
                    ) &&
                    ANIMALS.some((animal) =>
                      animal.children.some(
                        (child) => !getValues[`${animal.name}.${child.name}`]
                      )
                    )
                  }
                  checked={
                    ANIMALS.every((animal) =>
                      animal.children.every(
                        (child) => getValues[`${animal.name}.${child.name}`]
                      )
                    ) && ANIMALS.length > 0
                  }
                  onChange={(event) => handleSelectAll(event.target.checked)}
                />
              </TableCell>
              <TableCell>Animal</TableCell>
              <TableCell align="right">Expand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderAnimals(ANIMALS)}</TableBody>
        </Table>
      </TableContainer>
      {/* <Button type="submit">Submit</Button> */}
      {/* </form> */}
    </div>
  )
}

export default NestedCheckboxTable

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from '@mui/material';
// import Paper from "@mui/material/Paper";
//
// const ANIMALS = [
//   {
//     name: 'Farm',
//     children: [
//       { name: 'Chicken' },
//       { name: 'Cow' },
//       { name: 'Sheep' },
//     ],
//   },
//   {
//     name: 'Domestic',
//     children: [
//       { name: 'Dog' },
//       { name: 'Cat' },
//     ],
//   },
// ];
//
// function NestedCheckboxTable() {
//   const {control, handleSubmit, getValues, setValue} = useForm();
//   const [expandedAnimals, setExpandedAnimals] = useState([]);
//
//   // const onSubmit = (data) => {
//   //   console.log(data);
//   // };
//
//   const handleSelectAll = (checked) => {
//     ANIMALS.forEach((animal) => {
//       setValue(animal.name, checked);
//       animal.children.forEach((child) => {
//         setValue(`${animal.name}.${child.name}`, checked);
//       });
//     });
//   };
//
//   const handleExpandAnimal = (animalName) => {
//     setExpandedAnimals((prevExpanded) =>
//       prevExpanded.includes(animalName)
//         ? prevExpanded.filter((name) => name !== animalName)
//         : [...prevExpanded, animalName]
//     );
//   };
//
//   const isAnimalExpanded = (animalName) => expandedAnimals.includes(animalName);
//
//   const isAnimalChecked = (animalName) => {
//     return ANIMALS.find((animal) => animal.name === animalName).children.every((child) => {
//       return getValues()[`${animalName}.${child.name}`];
//     });
//   };
//
//   const handleCheckAnimal = (event) => {
//     const animalName = event.target.name;
//     const checked = event.target.checked;
//
//     setValue(animalName, checked);
//     ANIMALS.find((animal) => animal.name === animalName).children.forEach((child) => {
//       setValue(`${animalName}.${child.name}`, checked);
//     });
//   };
//
//   const handleCheckChild = (event) => {
//     const [animalName, childName] = event.target.name.split('.');
//     const checked = event.target.checked;
//
//     setValue(`${animalName}.${childName}`, checked);
//
//     // Check/uncheck the parent animal checkbox based on the child checkboxes
//     const isAnimalFullyChecked = ANIMALS.find((animal) => animal.name === animalName).children.every((child) => {
//       return getValues()[`${animalName}.${child.name}`];
//     });
//
//     setValue(animalName, isAnimalFullyChecked);
//   };
//
//   const renderAnimals = (ANIMALS) => {
//     return (
//       <>
//         {ANIMALS.map((animal) => (
//           <React.Fragment key={animal.name}>
//             <TableRow>
//               <TableCell>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       name={animal.name}
//                       checked={isAnimalChecked(animal.name)}
//                       onChange={handleCheckAnimal}
//                       color="primary"
//                       inputRef={control.register()}
//                     />
//                   }
//                   label={animal.name}
//                 />
//               </TableCell>
//               <TableCell align="right">
//                 <Button size="small" onClick={() => handleExpandAnimal(animal.name)}>
//                   {isAnimalExpanded(animal.name) ? '-' : '+'}
//                 </Button>
//               </TableCell>
//             </TableRow>
//             {animal.children.map((child) => (
//               <TableRow key={child.name}>
//                 <TableCell padding="checkbox"/>
//                 <TableCell>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         name={`${animal.name}.${child.name}`}
//                         checked={getValues()[`${animal.name}.${child.name}`]}
//                         onChange={handleCheckChild}
//                         color="primary"
//                         inputRef={control.register()}
//                       />
//                     }
//                     label={child.name}
//                   />
//                 </TableCell>
//                 <TableCell align="right"></TableCell>
//               </TableRow>
//             ))}
//             {isAnimalExpanded(animal.name) && (
//               <TableRow>
//                 <TableCell colSpan={3}>
//                   <div style={{marginLeft: 16}}>{renderAnimals(animal.children)}</div>
//                 </TableCell>
//               </TableRow>
//             )}
//           </React.Fragment>
//         ))}
//       </>
//     );
//   };
//
//
// }
//
// export default NestedCheckboxTable;
