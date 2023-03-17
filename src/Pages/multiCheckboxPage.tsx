import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
import type { TreeItemProps } from '@mui/lab/TreeItem'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import NestedCheckboxTable from '../Components/Form/NestedTable'

type TNestedCheckboxData = {
  id: string
  label: string
  checked: boolean
  children?: TNestedCheckboxData[]
}

type TNestedCheckbox = {
  id: string
  checked: boolean
  children?: TNestedCheckbox[]
}

type StyledTreeItemProps = TreeItemProps & {
  // bgColor?: string
  // color?: string
  // labelIcon: React.ElementType<SvgIconProps>
  // labelInfo?: string
  labelText: string
  level?: number
  checked: boolean
  checkBoxInfo: TNestedCheckbox
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void
}

const sampleData: TNestedCheckboxData[] = [
  {
    id: '9573',
    label:
      'National Dental Association Of Extremely Qualified Doctors with Outstanding Customer Service',
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
        label: 'Century City Dental Group',
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

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  // color: theme.palette.text.secondary,
  // [`& .${treeItemClasses.content}`]: {
  //   color: theme.palette.text.secondary,
  //   borderTopRightRadius: theme.spacing(2),
  //   borderBottomRightRadius: theme.spacing(2),
  //   paddingRight: theme.spacing(1),
  //   fontWeight: theme.typography.fontWeightMedium,
  //   '&.Mui-expanded': {
  //     fontWeight: theme.typography.fontWeightBold,
  //   },
  //   '&:hover': {
  //     backgroundColor: theme.palette.action.hover,
  //   },
  //   '&.custom-checked': {
  //     backgroundColor: theme.palette.action.selected,
  //   },
  [`& .${treeItemClasses.content}`]: {
    // '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
    '&.Mui-selected, &.Mui-focused': {
      backgroundColor: `${theme.palette.background.default}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      //   //   color: 'var(--tree-view-color)',
      //   // },
      //   [`& .${treeItemClasses.label}`]: {
      //     fontWeight: 'inherit',
      //     color: 'inherit',
      //   },
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      // paddingLeft: theme.spacing(4),
    },
  },
}))

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    // bgColor,
    // color,
    // labelIcon: LabelIcon,
    // labelInfo,
    checkBoxInfo: { checked, id, children },
    labelText,
    handleCheckToggle,
    level = 0,
    ...other
  } = props

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
            ml: 3 * level,
            borderBottom: '1px solid #eee',
          }}
        >
          <FormControlLabel
            label={labelText}
            control={<Checkbox checked={checked} />}
            sx={{ width: '100%' }}
            disableTypography
            onClick={(e) => handleCheckToggle(e, id)}
          />
        </Box>
      }
      // style={{
      //   '--tree-view-color': color,
      //   '--tree-view-bg-color': bgColor,
      // }}
      {...other}
    />
  )
}

function renderLevel(
  items: TNestedCheckbox[],
  labels: { [key: string]: string },
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void,
  toggleExpanded: (id: string) => void,
  level = 0
): React.ReactNode {
  return items.map((item) => {
    const { checked, id, children } = item
    return children ? (
      <StyledTreeItem
        nodeId={id}
        // labelText={`${level} - ${label}`}
        // labelText={`${label}`}
        checkBoxInfo={item}
        labelText={labels[id]}
        key={id}
        level={level}
        checked={checked}
        handleCheckToggle={handleCheckToggle}
        onClick={() => toggleExpanded(id)}
      >
        {renderLevel(
          children,
          labels,
          handleCheckToggle,
          toggleExpanded,
          level + 1
        )}
      </StyledTreeItem>
    ) : (
      <StyledTreeItem
        nodeId={id}
        // labelText={`${level} - ${label}`}
        // labelText={`${label}`}
        checkBoxInfo={item}
        labelText={labels[id]}
        key={id}
        level={level}
        checked={checked}
        handleCheckToggle={handleCheckToggle}
      />
    )
  })
}

function reduceLabels(
  nestedData: TNestedCheckboxData[],
  destinationObject: { [key: string]: string }
) {
  nestedData.forEach(({ id, label, children }) => {
    destinationObject[id] = label
    if (children) {
      reduceLabels(children, destinationObject)
    }
  })
  return destinationObject
}

function getCheckedState<T extends TNestedCheckbox>(
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
    const res = dataLevel.map((dataElement) => {
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
      // const result: TNestedCheckbox = { checked, id }
      // if (children) {
      //   result.children = extract(children)
      // }
      // return result
    })

    return res
  }

  return extract(data)
}

export default function MultiCheckboxPage() {
  const labels = reduceLabels(sampleData, {})
  // console.log('labels: ', labels)

  const [checked, setChecked] = React.useState((): TNestedCheckbox[] =>
    getCheckedState(sampleData)
  )

  const [expanded, setExpanded] = React.useState<string[]>([])

  const toggleExpanded = (id: string) => {
    console.log('expanded toggle! ', id, expanded)
    setExpanded((oldExpanded) => {
      const newExpanded = [...oldExpanded]
      const indexOfId = newExpanded.indexOf(id)

      console.log('index', indexOfId)

      if (indexOfId === -1) {
        newExpanded.push(id)
      } else {
        newExpanded.splice(indexOfId, 1)
      }
      return newExpanded
    })
  }

  function toggleCheckedById(
    data: TNestedCheckbox[],
    id: string
  ): TNestedCheckbox[] {
    return data.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked }
      }

      if (item.children) {
        return { ...item, children: toggleCheckedById(item.children, id) }
      }
      return item
    })
  }

  const handleCheckToggle = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setChecked((prevState) => toggleCheckedById(prevState, id))
  }

  // console.log('extracted: ', getCheckedState(sampleData))

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        sx={{
          // height: 264,
          flexGrow: 1,
          // maxWidth: 400,
          overflowY: 'auto',
        }}
      >
        {renderLevel(checked, labels, handleCheckToggle, toggleExpanded)}
      </TreeView>

      <NestedCheckboxTable />
    </>
  )
}
