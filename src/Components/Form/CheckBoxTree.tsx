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
import { SxProps } from '@mui/system'
import type { FieldValues, Control, FieldPath } from 'react-hook-form'
import { useController } from 'react-hook-form'
// import { useEffect } from 'react'

export type TNestedCheckbox = {
  id: string
  checked: boolean
  children?: TNestedCheckbox[]
}

type TCheckboxLabel = {
  [key: string]: string
}

type TLeafCheckBoxNode = TreeItemProps & {
  labelText: string
  checkBoxInfo: TNestedCheckbox
  offsetLevel?: number
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void
}

type TInternalCheckBoxNode = TLeafCheckBoxNode & {
  handleExpandTree: (id: string) => void
  handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void
}

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

type TCheckBoxTreeProps<T extends FieldValues> = {
  labels: TCheckboxLabel
  defaultValues?: TNestedCheckbox[]
  maxHeight?: number
  control: Control<T>
  name: FieldPath<T>
  sx?: SxProps
}

export default function CheckBoxTree<TFormData extends FieldValues>({
  labels,
  defaultValues,
  sx,
  maxHeight,
  control,
  name,
}: TCheckBoxTreeProps<TFormData>) {
  if (!labels.default) {
    labels.default = 'unknown option'
  }

  const {
    field: { onChange, value },
  } = useController({ control, name })

  // initialize checked state with defaultValues:
  const [checked, setChecked] = React.useState(
    (): TNestedCheckbox[] => value || defaultValues || []
  )

  React.useEffect(() => {
    onChange(checked)
  }, [checked, onChange])

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

  const handleToggleExpanded = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded((prevState) => toggleExpanded(prevState, id))
  }

  const handleExpandTree = (id: string) => {
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

  const handleCheckToggle = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setChecked((prevState) => toggleCheckedById(prevState, id))
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      sx={{
        maxHeight,
        // height: 264,
        // maxWidth: 400,
        flexGrow: 1,
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      {renderTreeLevel(
        checked,
        labels,
        handleCheckToggle,
        handleToggleExpanded,
        handleExpandTree,
        sx || {}
      )}
    </TreeView>
  )
}

// ************** COMPONENTS *****************

function LeafCheckBoxNode(props: TLeafCheckBoxNode) {
  const {
    checkBoxInfo: { checked, id },
    labelText,
    handleCheckToggle,
    offsetLevel = 0,
    sx = {},
    ...other
  } = props
  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            // pr: 0,
            ml: 4 * offsetLevel,
            borderBottom: '1px solid #eee',
            ...sx,
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
    handleExpandTree,
    handleToggleExpanded,
    offsetLevel = 0,
    sx = {},
    ...other
  } = props

  const atLeastOneChildSelected = someChecked(children)
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
            ...sx,
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
                  if (handleExpandTree) {
                    // when node is internal, i.e. is a parent and has children: selecting the checkbox on or off
                    // will expand entire subtree to show that everything was toggled
                    handleExpandTree(id)
                  }
                }}
              />
            }
            sx={{ width: '100%' }}
            disableTypography
            onClick={(e) => handleToggleExpanded(e, id)}
          />
        </Box>
      }
      {...other}
    />
  )
}

// ************** HELPER FUNCTIONS ****************
function someChecked(subtree: TNestedCheckbox[]): boolean {
  // recursive function that goes over subtree and return whether at least one node is checked
  return subtree.some((child) => {
    if (child.children) {
      return someChecked(child.children)
    }
    return child.checked
  })
}

function renderTreeLevel(
  items: TNestedCheckbox[],
  labels: TCheckboxLabel,
  handleCheckToggle: (e: React.SyntheticEvent, id: string) => void,
  handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void,
  handleExpandTree: (id: string) => void,
  sx: SxProps,
  level = 0
): React.ReactNode {
  // recursive function that renders the tree of checkboxes
  // InternalCheckBoxNode - parent node that has children
  // LeafCheckBoxNode - leaf node that has no children
  return items.map((item) => {
    const { id, children } = item
    return children ? (
      <InternalCheckBoxNode
        nodeId={id}
        checkBoxInfo={item}
        labelText={labels[id] || labels.default}
        key={id}
        offsetLevel={level}
        handleCheckToggle={handleCheckToggle}
        handleExpandTree={handleExpandTree}
        handleToggleExpanded={handleToggleExpanded}
        sx={sx}
      >
        {renderTreeLevel(
          children,
          labels,
          handleCheckToggle,
          handleToggleExpanded,
          handleExpandTree,
          sx,
          level + 1
        )}
      </InternalCheckBoxNode>
    ) : (
      <LeafCheckBoxNode
        nodeId={id}
        checkBoxInfo={item}
        labelText={labels[id] || labels.default}
        key={id}
        offsetLevel={level}
        handleCheckToggle={handleCheckToggle}
        sx={sx}
      />
    )
  })
}

function setCheckedAll(
  subTree: TNestedCheckbox[],
  checkedValue: boolean
): TNestedCheckbox[] {
  // returns a deep copy of array with all values set to checkedValue
  return subTree.map((item) => {
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
}

function toggleCheckedById(
  data: TNestedCheckbox[],
  id: string
): TNestedCheckbox[] {
  // finds a node with given id and toggles its checked state, updates state of all children
  // and recalculates states of all parents
  const result = data.map((item) => {
    if (item.id === id) {
      // once node with id is found, toggle checked state
      if (item.children) {
        // if updated node has children, set them all to the same value
        return {
          ...item,
          checked: !item.checked,
          children: setCheckedAll(item.children, !item.checked),
        }
      }
      // if node has no children, simply toggle the state
      return { ...item, checked: !item.checked }
    }
    if (item.children) {
      // if a node has children, recursively continue search on next level
      return { ...item, children: toggleCheckedById(item.children, id) }
    }
    return item
  })

  // once all toggles are taken care of, update all parent nodes to correct checked value
  const updateInnerNodes = (subtree: TNestedCheckbox[]): TNestedCheckbox[] =>
    subtree.map((element) => {
      if (element.children) {
        // parent's checked state depends on all values of its children
        // calculate all children and run update on children level

        // recursively get to the deepest parent
        const parent = {
          ...element,
          children: updateInnerNodes(element.children),
        }

        const allChildrenChecked = parent.children.every(
          (child) => child.checked
        )
        // set parent's checked state based on children values
        parent.checked = allChildrenChecked
        return parent
      }
      return element
    })

  return updateInnerNodes(result)
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

function toggleExpanded(prevState: string[], id: string) {
  // creates a copy of prevState object and either removes or adds id to the array
  // expanded state of parent nodes is stored in flat array and contains ids of parents that have to be expanded
  const newState = [...prevState]
  const indexOfId = newState.indexOf(id)

  if (indexOfId === -1) {
    newState.push(id)
  } else {
    newState.splice(indexOfId, 1)
  }
  return newState
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
