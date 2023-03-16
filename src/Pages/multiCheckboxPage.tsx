import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
import type { TreeItemProps } from '@mui/lab/TreeItem'
import Typography from '@mui/material/Typography'
import MailIcon from '@mui/icons-material/Mail'
import DeleteIcon from '@mui/icons-material/Delete'
import Label from '@mui/icons-material/Label'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

type StyledTreeItemProps = TreeItemProps & {
  // bgColor?: string
  // color?: string
  // labelIcon: React.ElementType<SvgIconProps>
  // labelInfo?: string
  labelText: string
  level?: number
}

type TNestedCheckboxData = {
  id: string
  label: string
  checked: boolean
  children?: TNestedCheckboxData[]
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
    labelText,
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
          }}
        >
          <FormControlLabel
            label={labelText}
            control={<Checkbox />}
            sx={{ width: '100%' }}
            disableTypography
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
  items: TNestedCheckboxData[],
  labels: { [key: string]: string },
  level = 0
): React.ReactNode {
  return items.map((item) => {
    const { checked, id, label, children } = item
    return children ? (
      <StyledTreeItem
        nodeId={id.toString()}
        // labelText={`${level} - ${label}`}
        // labelText={`${label}`}
        labelText={labels[id]}
        key={id}
        level={level}
      >
        {renderLevel(children, labels, level + 1)}
      </StyledTreeItem>
    ) : (
      <StyledTreeItem
        nodeId={id.toString()}
        // labelText={`${level} - ${label}`}
        // labelText={`${label}`}
        labelText={labels[id]}
        key={id}
        level={level}
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

export default function MultiCheckboxPage() {
  const labels = reduceLabels(sampleData, {})
  console.log('labels: ', labels)

  return (
    <TreeView
      aria-label="gmail"
      // defaultExpanded={['3']}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      // defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{
        // height: 264,
        flexGrow: 1,
        // maxWidth: 400,
        overflowY: 'auto',
      }}
    >
      {renderLevel(sampleData, labels)}
    </TreeView>
  )
}
