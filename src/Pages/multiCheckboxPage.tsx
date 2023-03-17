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

type TLeafCheckBoxNode = TreeItemProps & {
  labelText: string
  checkBoxInfo: TNestedCheckbox
  offsetLevel?: number
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void
}

type TInternalCheckBoxNode = TLeafCheckBoxNode & {
  expandTree: (id: string) => void
  handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void
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
  expandTree?: (id: string) => void
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
    // '> .MuiTreeItem-iconContainer': {
    //   marginLeft: offsetLevel as number, // theme.spacing(-2),
    // },
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
    // [`& .${treeItemClasses.content}`]: {
    //   // paddingLeft: theme.spacing(4),
    // },
  },
}))

function LeafCheckBoxNode(props: TLeafCheckBoxNode) {
  const {
    checkBoxInfo: { checked, id },
    labelText,
    handleCheckToggle,
    offsetLevel = 0,
    ...other
  } = props
  return (
    <StyledTreeItemRoot
      // offsetLevel={offsetLevel}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            // pr: 0,

            ml: 4 * offsetLevel,
            borderBottom: '1px solid #eee',
          }}
        >
          <FormControlLabel
            label={labelText}
            control={<Checkbox checked={checked} />}
            sx={{ width: '100%' }}
            disableTypography
            onClick={(e) => {
              handleCheckToggle(e, id)
            }}
          />
        </Box>
      }
      {...other}
    />
  )
}

function InternalCheckBoxNode(props: TInternalCheckBoxNode) {
  const {
    checkBoxInfo: { checked, id, children = [] },
    labelText,
    handleCheckToggle,
    expandTree,
    handleToggleExpanded,
    offsetLevel = 0,
    ...other
  } = props

  const checkSomeChecked = (subtree: TNestedCheckbox[]): boolean =>
    subtree.some((child) => {
      if (child.children) {
        return checkSomeChecked(child.children)
      }
      return child.checked
    })

  const atLeastOneChildSelected = checkSomeChecked(children)
  const indeterminate = !checked && atLeastOneChildSelected
  return (
    <StyledTreeItemRoot
      onClick={(e) => handleToggleExpanded(e, id)}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            pr: 0,
            ml: 4 * offsetLevel,
            borderBottom: '1px solid #eee',
          }}
        >
          <FormControlLabel
            label={labelText}
            control={
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onClick={(e) => {
                  handleCheckToggle(e, id)
                  if (expandTree) {
                    // when node is internal, selecting the checkbox on or off
                    // will expand entire subtree to show that everything was toggled
                    expandTree(id)
                  }
                }}
              />
            }
            sx={{ width: '100%' }}
            disableTypography
            onClick={(e) => handleToggleExpanded(e, id)}
            // onClick={(e) => {
            //   handleCheckToggle(e, id)
            //   if (expandTree) {
            //     // whne node is internal, selecting the checkbox on or off
            //     // will expand entire subtree to show that everything was toggled
            //     expandTree(id)
            //   }
            // }}
          />
        </Box>
      }
      {...other}
    />
  )
}

function renderLevel(
  items: TNestedCheckbox[],
  labels: { [key: string]: string },
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void,
  handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void,
  expandTree: (id: string) => void,
  level = 0
): React.ReactNode {
  return items.map((item) => {
    const { id, children } = item
    return children ? (
      <InternalCheckBoxNode
        nodeId={id}
        checkBoxInfo={item}
        labelText={labels[id]}
        key={id}
        offsetLevel={level}
        handleCheckToggle={handleCheckToggle}
        expandTree={expandTree}
        handleToggleExpanded={handleToggleExpanded}
        // onClick={() => handleToggleExpanded(id)}
      >
        {renderLevel(
          children,
          labels,
          handleCheckToggle,
          handleToggleExpanded,
          expandTree,
          level + 1
        )}
      </InternalCheckBoxNode>
    ) : (
      <LeafCheckBoxNode
        nodeId={id}
        checkBoxInfo={item}
        labelText={labels[id]}
        key={id}
        offsetLevel={level}
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

function getExpandableNodeIds(tree: TNestedCheckbox[]) {
  // find all expandable node ID in a given tree
  let ids: string[] = []
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].children) {
      ids.push(tree[i].id)
      ids = ids.concat(
        getExpandableNodeIds(tree[i].children as TNestedCheckbox[])
      )
    }
  }
  return ids
}

export default function MultiCheckboxPage() {
  const labels = reduceLabels(sampleData, {})
  const [checked, setChecked] = React.useState((): TNestedCheckbox[] =>
    getCheckedState(sampleData)
  )

  // const labels = reduceLabels(sampleData, { getall: 'Select All' })

  // const [checked, setChecked] = React.useState((): TNestedCheckbox[] =>
  //   getCheckedState([
  //     {
  //       checked: false,
  //       id: 'getall',
  //       children: sampleData,
  //     },
  //   ])
  // )

  //
  const [expanded, setExpanded] = React.useState<string[]>(
    getExpandableNodeIds(checked)
  )

  const toggleExpanded = (prevState: string[], id: string) => {
    console.log('expanded toggle! ', id, prevState)
    const newState = [...prevState]
    const indexOfId = newState.indexOf(id)

    if (indexOfId === -1) {
      newState.push(id)
    } else {
      newState.splice(indexOfId, 1)
    }
    return newState
  }

  const handleToggleExpanded = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded((prevState) => toggleExpanded(prevState, id))
  }

  function getNodeById(
    tree: TNestedCheckbox[],
    id: string
  ): TNestedCheckbox | null {
    // find a node with a given ID
    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i].id === id) {
        return tree[i]
      }
      if (tree[i].children) {
        const result = getNodeById(tree[i].children as TNestedCheckbox[], id)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const expandTree = (id: string) => {
    // find the node to fully expand
    const nodeToExpand = getNodeById(checked, id)
    if (!nodeToExpand) return

    // get ids of the node to expand + all of its expandable children
    const expandableIds = getExpandableNodeIds([nodeToExpand])

    setExpanded((oldExpanded) => {
      // create a set from both previously expanded elements and all expandable nodes for a given id
      // set will eliminate all duplicates
      const newExpanded = new Set(oldExpanded.concat(expandableIds))
      // convert set back to array
      return [...newExpanded]
    })
  }

  const setCheckedAll = (
    subTree: TNestedCheckbox[],
    checkedValue: boolean
  ): TNestedCheckbox[] =>
    // returns a deep copy of array with all values set to checkedValue
    subTree.map((item) => {
      if (item.children) {
        return {
          ...item,
          checked: checkedValue,
          children: setCheckedAll(item.children, checkedValue),
        }
      }
      return {
        ...item,
        checked: checkedValue,
      }
    })

  function toggleCheckedById(
    data: TNestedCheckbox[],
    id: string
  ): TNestedCheckbox[] {
    // const result =
    const result = data.map((item) => {
      if (item.id === id) {
        if (item.children) {
          return {
            ...item,
            checked: !item.checked,
            children: setCheckedAll(item.children, !item.checked),
          }
        }
        return { ...item, checked: !item.checked }
      }
      if (item.children) {
        return { ...item, children: toggleCheckedById(item.children, id) }
      }
      return item
    })

    const updateInnerNodes = (subtree: TNestedCheckbox[]): TNestedCheckbox[] =>
      subtree.map((element) => {
        if (element.children) {
          // calculate all children and run update on children level
          const allChildrenChecked = element.children.every(
            (child) => child.checked
          )
          return {
            ...element,
            checked: allChildrenChecked,
            children: updateInnerNodes(element.children),
          }
        }
        return element
      })

    return updateInnerNodes(result)
  }

  const handleCheckToggle = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    // parents = []
    setChecked((prevState) => toggleCheckedById(prevState, id))
    // console.log('parents encountered: ', parents)
  }

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
          userSelect: 'none',
        }}
      >
        {renderLevel(
          checked,
          labels,
          handleCheckToggle,
          handleToggleExpanded,
          expandTree
        )}
      </TreeView>

      {/* <NestedCheckboxTable /> */}
    </>
  )
}
