/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { TreeItemProps } from '@mui/lab/TreeItem'
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'

import { useController } from 'react-hook-form'
import type { Control, FieldValues, FieldPath } from 'react-hook-form'
import { isEmptyObject } from '../../utils/utils'

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
  handleTreeCollapse?: () => void
}

type TRootNodeProps = {
  id: string
  checked: boolean
  indeterminate: boolean
  labelText: string
  sx?: any
  toggleExpandTree: () => void
  toggleCheckAll: (checked: boolean) => void
}

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    '& .MuiTreeItem-label': {
      fontWeight: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
  },
  '&.rootnode': {
    [`&>.${treeItemClasses.content}`]: {
      backgroundColor: theme.palette.grey[200],
      fontWeight: theme.typography.fontWeightMedium,
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  },
  '&.childnode': {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.fontSize,
    [`&>.${treeItemClasses.content}`]: {
      backgroundColor: theme.palette.background.default,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: theme.palette.background.default,
      },
    },
  },
}))

type TCheckBoxTreeProps<T extends FieldValues> = {
  labels: TCheckboxLabel
  maxHeight?: number
  control: Control<T>
  name: FieldPath<T>
  caption: string
  sx?: any
  onChangeCallback?: (selected: TNestedCheckbox[]) => any
}

export default function FormInputCheckBoxTree<TFormData extends FieldValues>({
  labels: labelsInit,
  onChangeCallback,
  maxHeight,
  control,
  name,
  caption,
  sx,
}: TCheckBoxTreeProps<TFormData>) {
  const labels = React.useMemo(
    () => addRootLabel(labelsInit, caption),
    [labelsInit, caption]
  )

  if (!labels.default) {
    // label that will be used for nodes where label is unkown
    labels.default = 'unknown option'
  }

  const {
    field: { onChange: setTreeExternalState, value: treeExternalState },
  } = useController({ control, name })

  const [rootState, setRootState] = React.useState(() =>
    getRootState(treeExternalState)
  )

  // update state of the root on every change of the tree state
  React.useEffect(
    () => setRootState(getRootState(treeExternalState)),
    [treeExternalState]
  )

  const [expanded, setExpanded] = React.useState<string[]>(
    // this line expands tree completely
    // getExpandableNodeIds(checked)
    []
  )

  React.useEffect(() => {
    if (typeof onChangeCallback === 'function') {
      onChangeCallback(treeExternalState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeExternalState])

  const handleToggleExpanded = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleExpanded(expanded, id)
    setExpanded(newState)
  }

  const collapseTree = (): void => {
    setExpanded([])
  }

  const expandTree = (): void => {
    const expandableIds = getExpandableNodeIds(treeExternalState, false)
    setExpanded(expandableIds)
  }

  const toggleExpandTree = () => {
    if (expanded.length > 0) {
      collapseTree()
    } else {
      expandTree()
    }
  }

  const toggleCheckAll = (checked: boolean): void => {
    if (checked) {
      setTreeExternalState(setCheckedAll(treeExternalState, false))
    } else {
      setTreeExternalState(setCheckedAll(treeExternalState, true))
    }
    // expand entire tree on mass select/deselect:
    const expandableIds = getExpandableNodeIds(treeExternalState, true)
    setExpanded(expandableIds)
  }

  const handleExpandTree = (id: string) => {
    // find the node to fully expand
    const nodeToExpand = getNodeById(treeExternalState, id)
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
    const newState = toggleCheckedById(treeExternalState, id)
    setTreeExternalState(newState)
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      sx={{
        maxHeight,
        flexGrow: 1,
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      <RootNode
        id="root"
        checked={rootState.checked}
        indeterminate={rootState.indeterminate}
        labelText={labels.root || labels.default}
        key="root"
        toggleCheckAll={toggleCheckAll}
        toggleExpandTree={toggleExpandTree}
      />
      {renderTreeLevel(
        treeExternalState,
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

function RootNode(props: TRootNodeProps) {
  const {
    id,
    checked,
    indeterminate,
    labelText,
    toggleCheckAll,
    toggleExpandTree,
    sx = {},
    ...other
  } = props

  return (
    <StyledTreeItemRoot
      className="rootnode"
      key={id}
      nodeId={id}
      onClick={(e) => {
        // clicking on caption label will expand or collapse the whole tree
        e.stopPropagation()
        e.preventDefault()
        toggleExpandTree()
      }}
      label={
        <Box
          style={{ fontWeight: 'inherit' }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            pr: 0,
            borderBottom: '1px solid #eee',
            ...sx,
          }}
        >
          <FormControlLabel
            label={labelText}
            disableTypography
            control={
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCheckAll(checked)
                }}
              />
            }
            sx={{ width: '100%' }}
            style={{ fontWeight: 'inherit' }}
          />
        </Box>
      }
      {...other}
      style={{ fontWeight: 'inherit' }}
    />
  )
}

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
      className="childnode"
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
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
      className="childnode"
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
            disableTypography
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
            onClick={(e) => handleToggleExpanded(e, id)}
          />
        </Box>
      }
      {...other}
    />
  )
}

// ************** HELPER FUNCTIONS ****************

function addRootLabel(
  labels: TCheckboxLabel,
  labelText: string
): TCheckboxLabel {
  return {
    ...labels,
    root: labelText,
  }
}

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
  sx: any,
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
      if (!isEmptyObject(item.children)) {
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
    if (!isEmptyObject(item.children)) {
      // if a node has children, recursively continue search on next level
      return { ...item, children: toggleCheckedById(item.children, id) }
    }
    return item
  })

  // once all toggles are taken care of, update all parent nodes to correct checked value
  const updateInnerNodes = (subtree: TNestedCheckbox[]): TNestedCheckbox[] =>
    subtree.map((element) => {
      if (!isEmptyObject(element.children)) {
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

function getExpandableNodeIds(tree: TNestedCheckbox[], recursive = true) {
  // find all expandable node ID in a given tree
  let ids: string[] = []
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].children) {
      ids.push(tree[i].id)

      if (recursive) {
        ids = ids.concat(
          getExpandableNodeIds(tree[i].children as TNestedCheckbox[])
        )
      }
    }
  }
  return ids
}

function getRootState(tree: TNestedCheckbox[]) {
  let selected = true
  let atLeastOneSelected = false

  const traverseTree = (subtree: TNestedCheckbox[]) => {
    subtree.forEach(({ checked, children }) => {
      selected = selected && checked
      atLeastOneSelected = atLeastOneSelected || checked
      if (children?.length) {
        traverseTree(children)
      }
    })
  }

  traverseTree(tree)

  const indeterminate = !selected && atLeastOneSelected

  return {
    checked: selected,
    indeterminate,
  }
}

// import * as React from 'react'
// import { styled } from '@mui/material/styles'
// import Box from '@mui/material/Box'
// import TreeView from '@mui/lab/TreeView'
// import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
// import ChevronRightIcon from '@mui/icons-material/ChevronRight'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import Checkbox from '@mui/material/Checkbox'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import { useController } from 'react-hook-form'
// import type { TreeItemProps } from '@mui/lab/TreeItem'
// import type { SxProps } from '@mui/system'
// import type { FieldValues, Control, FieldPath } from 'react-hook-form'

// export type TNestedCheckbox = {
//   id: string
//   checked: boolean
//   children?: TNestedCheckbox[]
// }

// type TCheckboxLabel = {
//   [key: string]: string
// }

// type TLeafCheckBoxNode = TreeItemProps & {
//   labelText: string
//   checkBoxInfo: TNestedCheckbox
//   offsetLevel?: number
//   handleCheckToggle: (e: React.SyntheticEvent, id: string) => void
// }

// type TInternalCheckBoxNode = TLeafCheckBoxNode & {
//   handleExpandTree: (id: string) => void
//   handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void
//   handleTreeCollapse?: () => void
// }

// type TRootNodeProps = {
//   id: string
//   checked: boolean
//   indeterminate: boolean
//   labelText: string
//   sx?: SxProps
//   // checkBoxInfo: TNestedCheckbox
//   toggleExpandTree: () => void
//   // handleExpandTree: (id: string) => void
//   toggleCheckAll: (checked: boolean) => void
// }

// const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
//   [`& .${treeItemClasses.content}`]: {
//     '& .MuiTreeItem-label': {
//       fontWeight: 'inherit',
//     },
//   },
//   [`& .${treeItemClasses.group}`]: {
//     marginLeft: 0,
//   },
//   '&.rootnode': {
//     [`&>.${treeItemClasses.content}`]: {
//       backgroundColor: theme.palette.grey[200],
//       fontWeight: theme.typography.fontWeightMedium,
//       '&:hover': {
//         backgroundColor: theme.palette.grey[200],
//       },
//     },
//   },
//   '&.childnode': {
//     fontWeight: theme.typography.fontWeightRegular,
//     fontSize: theme.typography.fontSize,
//     [`&>.${treeItemClasses.content}`]: {
//       backgroundColor: theme.palette.background.default,
//       '&:hover': {
//         backgroundColor: theme.palette.action.hover,
//       },
//       '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
//         backgroundColor: theme.palette.background.default,
//       },
//     },
//   },
// }))

// type TCheckBoxTreeProps<T extends FieldValues> = {
//   labels: TCheckboxLabel
//   // defaultValues?: TNestedCheckbox[]
//   maxHeight?: number
//   control: Control<T>
//   name: FieldPath<T>
//   caption: string
//   sx?: SxProps
// }

// export default function CheckBoxTree<TFormData extends FieldValues>({
//   labels: labelsInit,
//   // defaultValues,
//   maxHeight,
//   control,
//   name,
//   caption,
//   sx,
// }: TCheckBoxTreeProps<TFormData>) {
//   const labels = React.useMemo(
//     () => addRootLabel(labelsInit, caption),
//     [labelsInit, caption]
//   )

//   if (!labels.default) {
//     // label that will be used for nodes where label is unkown
//     labels.default = 'unknown option'
//   }

//   const {
//     field: { onChange: setTreeExternalState, value: treeExternalState },
//   } = useController({ control, name })

//   const [rootState, setRootState] = React.useState(() =>
//     getRootState(treeExternalState)
//   )

//   // update state of the root on every change of the tree state
//   React.useEffect(
//     () => setRootState(getRootState(treeExternalState)),
//     [treeExternalState]
//   )

//   const [expanded, setExpanded] = React.useState<string[]>(
//     // this line expands tree completely
//     // getExpandableNodeIds(checked)
//     []
//   )

//   React.useEffect(() => {
//     console.log('treeExternalState has changed', treeExternalState)
//   }, [treeExternalState])

//   const handleToggleExpanded = (e: React.SyntheticEvent, id: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const newState = toggleExpanded(expanded, id)
//     setExpanded(newState)
//   }

//   const collapseTree = (): void => {
//     setExpanded([])
//   }

//   const expandTree = (): void => {
//     const expandableIds = getExpandableNodeIds(treeExternalState, false)
//     setExpanded(expandableIds)
//   }

//   const toggleExpandTree = () => {
//     if (expanded.length > 0) {
//       collapseTree()
//     } else {
//       expandTree()
//     }
//   }

//   const toggleCheckAll = (checked: boolean): void => {
//     if (checked) {
//       setTreeExternalState(setCheckedAll(treeExternalState, false))
//     } else {
//       setTreeExternalState(setCheckedAll(treeExternalState, true))
//     }
//     // expand entire tree on mass select/deselect:
//     const expandableIds = getExpandableNodeIds(treeExternalState, true)
//     setExpanded(expandableIds)
//   }

//   const handleExpandTree = (id: string) => {
//     // find the node to fully expand
//     const nodeToExpand = getNodeById(treeExternalState, id)
//     if (!nodeToExpand) return

//     // get ids of the node to expand + all of its expandable children
//     const expandableIds = getExpandableNodeIds([nodeToExpand])

//     setExpanded((oldExpanded) => {
//       // create a set from both previously expanded elements and all expandable nodes for a given id
//       // set will eliminate all duplicates
//       const newExpanded = new Set(oldExpanded.concat(expandableIds))
//       // convert set back to array
//       console.log('new expanded: ', newExpanded)
//       return [...newExpanded]
//     })
//   }

//   const handleCheckToggle = (e: React.SyntheticEvent, id: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const newState = toggleCheckedById(treeExternalState, id)
//     setTreeExternalState(newState)
//   }

//   return (
//     <TreeView
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//       expanded={expanded}
//       sx={{
//         maxHeight,
//         // height: 264,
//         // maxWidth: 400,
//         flexGrow: 1,
//         overflowY: 'auto',
//         userSelect: 'none',
//       }}
//     >
//       <RootNode
//         id="root"
//         checked={rootState.checked}
//         indeterminate={rootState.indeterminate}
//         labelText={labels.root || labels.default}
//         key="root"
//         toggleCheckAll={toggleCheckAll}
//         toggleExpandTree={toggleExpandTree}
//       />
//       {renderTreeLevel(
//         treeExternalState,
//         labels,
//         handleCheckToggle,
//         handleToggleExpanded,
//         handleExpandTree,
//         sx || {}
//       )}
//     </TreeView>
//   )
// }

// // ************** COMPONENTS *****************

// function RootNode(props: TRootNodeProps) {
//   const {
//     id,
//     checked,
//     indeterminate,
//     labelText,
//     toggleCheckAll,
//     toggleExpandTree,
//     sx = {},
//     ...other
//   } = props

//   return (
//     <StyledTreeItemRoot
//       className="rootnode"
//       key={id}
//       nodeId={id}
//       onClick={(e) => {
//         // clicking on caption label will expand or collapse the whole tree
//         e.stopPropagation()
//         e.preventDefault()
//         toggleExpandTree()
//       }}
//       label={
//         <Box
//           style={{ fontWeight: 'inherit' }}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             p: 0,
//             pr: 0,
//             borderBottom: '1px solid #eee',
//             ...sx,
//           }}
//         >
//           <FormControlLabel
//             label={labelText}
//             disableTypography
//             control={
//               <Checkbox
//                 checked={checked}
//                 indeterminate={indeterminate}
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   toggleCheckAll(checked)
//                 }}
//               />
//             }
//             sx={{ width: '100%' }}
//             style={{ fontWeight: 'inherit' }}
//           />
//         </Box>
//       }
//       {...other}
//       style={{ fontWeight: 'inherit' }}
//     />
//   )
// }

// function LeafCheckBoxNode(props: TLeafCheckBoxNode) {
//   const {
//     checkBoxInfo: { checked, id },
//     labelText,
//     handleCheckToggle,
//     offsetLevel = 0,
//     sx = {},
//     ...other
//   } = props
//   return (
//     <StyledTreeItemRoot
//       className="childnode"
//       label={
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             p: 0,
//             // pr: 0,
//             ml: 4 * offsetLevel,
//             borderBottom: '1px solid #eee',
//             ...sx,
//           }}
//         >
//           <FormControlLabel
//             label={labelText}
//             control={<Checkbox checked={checked} />}
//             sx={{ width: '100%' }}
//             disableTypography
//             onClick={(e) => {
//               handleCheckToggle(e, id)
//             }}
//           />
//         </Box>
//       }
//       {...other}
//     />
//   )
// }

// function InternalCheckBoxNode(props: TInternalCheckBoxNode) {
//   const {
//     checkBoxInfo: { checked, id, children = [] },
//     labelText,
//     handleCheckToggle,
//     handleExpandTree,
//     handleToggleExpanded,
//     offsetLevel = 0,
//     sx = {},
//     ...other
//   } = props

//   const atLeastOneChildSelected = someChecked(children)
//   const indeterminate = !checked && atLeastOneChildSelected
//   return (
//     <StyledTreeItemRoot
//       className="childnode"
//       onClick={(e) => handleToggleExpanded(e, id)}
//       label={
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             p: 0,
//             pr: 0,
//             ml: 4 * offsetLevel,
//             borderBottom: '1px solid #eee',
//             ...sx,
//           }}
//         >
//           <FormControlLabel
//             label={labelText}
//             disableTypography
//             control={
//               <Checkbox
//                 checked={checked}
//                 indeterminate={indeterminate}
//                 onClick={(e) => {
//                   handleCheckToggle(e, id)
//                   if (handleExpandTree) {
//                     // when node is internal, i.e. is a parent and has children: selecting the checkbox on or off
//                     // will expand entire subtree to show that everything was toggled
//                     handleExpandTree(id)
//                   }
//                 }}
//               />
//             }
//             sx={{ width: '100%' }}
//             onClick={(e) => handleToggleExpanded(e, id)}
//           />
//         </Box>
//       }
//       {...other}
//     />
//   )
// }

// // ************** HELPER FUNCTIONS ****************

// function addRootLabel(
//   labels: TCheckboxLabel,
//   labelText: string
// ): TCheckboxLabel {
//   return {
//     ...labels,
//     root: labelText,
//   }
// }

// function someChecked(subtree: TNestedCheckbox[]): boolean {
//   // recursive function that goes over subtree and return whether at least one node is checked
//   return subtree.some((child) => {
//     if (child.children) {
//       return someChecked(child.children)
//     }
//     return child.checked
//   })
// }

// function renderTreeLevel(
//   items: TNestedCheckbox[],
//   labels: TCheckboxLabel,
//   handleCheckToggle: (e: React.SyntheticEvent, id: string) => void,
//   handleToggleExpanded: (e: React.SyntheticEvent, id: string) => void,
//   handleExpandTree: (id: string) => void,
//   // handleTreeCollapse: () => void,
//   sx: SxProps,
//   level = 0
// ): React.ReactNode {
//   // recursive function that renders the tree of checkboxes
//   // InternalCheckBoxNode - parent node that has children
//   // LeafCheckBoxNode - leaf node that has no children
//   return items.map((item) => {
//     const { id, children } = item
//     // if (level === -1) {
//     //   return (
//     //     <React.Fragment key={`rootkey-${id}`}>

//     //       {renderTreeLevel(
//     //         children || [],
//     //         labels,
//     //         handleCheckToggle,
//     //         handleToggleExpanded,
//     //         handleExpandTree,
//     //         handleTreeCollapse,
//     //         sx,
//     //         level + 1
//     //       )}
//     //     </React.Fragment>
//     //   )
//     // }
//     return children ? (
//       <InternalCheckBoxNode
//         nodeId={id}
//         checkBoxInfo={item}
//         labelText={labels[id] || labels.default}
//         key={id}
//         offsetLevel={level}
//         handleCheckToggle={handleCheckToggle}
//         handleExpandTree={handleExpandTree}
//         handleToggleExpanded={handleToggleExpanded}
//         sx={sx}
//       >
//         {renderTreeLevel(
//           children,
//           labels,
//           handleCheckToggle,
//           handleToggleExpanded,
//           handleExpandTree,
//           // handleTreeCollapse,
//           sx,
//           level + 1
//         )}
//       </InternalCheckBoxNode>
//     ) : (
//       <LeafCheckBoxNode
//         nodeId={id}
//         checkBoxInfo={item}
//         labelText={labels[id] || labels.default}
//         key={id}
//         offsetLevel={level}
//         handleCheckToggle={handleCheckToggle}
//         sx={sx}
//       />
//     )
//   })
// }

// function setCheckedAll(
//   subTree: TNestedCheckbox[],
//   checkedValue: boolean
// ): TNestedCheckbox[] {
//   // returns a deep copy of array with all values set to checkedValue
//   return subTree.map((item) => {
//     if (item.children) {
//       return {
//         ...item,
//         checked: checkedValue,
//         children: setCheckedAll(item.children, checkedValue),
//       }
//     }
//     return {
//       ...item,
//       checked: checkedValue,
//     }
//   })
// }

// function toggleCheckedById(
//   data: TNestedCheckbox[],
//   id: string
// ): TNestedCheckbox[] {
//   // finds a node with given id and toggles its checked state, updates state of all children
//   // and recalculates states of all parents
//   const result = data.map((item) => {
//     if (item.id === id) {
//       // once node with id is found, toggle checked state
//       if (item.children) {
//         // if updated node has children, set them all to the same value
//         return {
//           ...item,
//           checked: !item.checked,
//           children: setCheckedAll(item.children, !item.checked),
//         }
//       }
//       // if node has no children, simply toggle the state
//       return { ...item, checked: !item.checked }
//     }
//     if (item.children) {
//       // if a node has children, recursively continue search on next level
//       return { ...item, children: toggleCheckedById(item.children, id) }
//     }
//     return item
//   })

//   // once all toggles are taken care of, update all parent nodes to correct checked value
//   const updateInnerNodes = (subtree: TNestedCheckbox[]): TNestedCheckbox[] =>
//     subtree.map((element) => {
//       if (element.children) {
//         // parent's checked state depends on all values of its children
//         // calculate all children and run update on children level

//         // recursively get to the deepest parent
//         const parent = {
//           ...element,
//           children: updateInnerNodes(element.children),
//         }

//         const allChildrenChecked = parent.children.every(
//           (child) => child.checked
//         )
//         // set parent's checked state based on children values
//         parent.checked = allChildrenChecked
//         return parent
//       }
//       return element
//     })

//   return updateInnerNodes(result)
// }

// function getNodeById(
//   tree: TNestedCheckbox[],
//   id: string
// ): TNestedCheckbox | null {
//   // find a node with a given ID
//   for (let i = 0; i < tree.length; i += 1) {
//     if (tree[i].id === id) {
//       return tree[i]
//     }
//     if (tree[i].children) {
//       const result = getNodeById(tree[i].children as TNestedCheckbox[], id)
//       if (result) {
//         return result
//       }
//     }
//   }
//   return null
// }

// function toggleExpanded(prevState: string[], id: string) {
//   console.log('toggle expanded', prevState, id)
//   // creates a copy of prevState object and either removes or adds id to the array
//   // expanded state of parent nodes is stored in flat array and contains ids of parents that have to be expanded
//   const newState = [...prevState]
//   const indexOfId = newState.indexOf(id)

//   if (indexOfId === -1) {
//     newState.push(id)
//   } else {
//     newState.splice(indexOfId, 1)
//   }
//   console.log('newState', newState)
//   return newState
// }

// function getExpandableNodeIds(tree: TNestedCheckbox[], recursive = true) {
//   // find all expandable node ID in a given tree
//   let ids: string[] = []
//   for (let i = 0; i < tree.length; i += 1) {
//     if (tree[i].children) {
//       ids.push(tree[i].id)

//       if (recursive) {
//         ids = ids.concat(
//           getExpandableNodeIds(tree[i].children as TNestedCheckbox[])
//         )
//       }
//     }
//   }
//   return ids
// }

// function getRootState(tree: TNestedCheckbox[]) {
//   let selected = true
//   let atLeastOneSelected = false

//   const traverseTree = (subtree: TNestedCheckbox[]) => {
//     subtree.forEach(({ checked, children }) => {
//       selected = selected && checked
//       atLeastOneSelected = atLeastOneSelected || checked
//       if (children?.length) {
//         traverseTree(children)
//       }
//     })
//   }

//   traverseTree(tree)

//   // const atLeastOneChildSelected = someChecked(tree)
//   const indeterminate = !selected && atLeastOneSelected
//   console.log('new root state:', {
//     atLeastOneSelected,
//     checked: selected,
//     indeterminate,
//   })
//   return {
//     checked: selected,
//     indeterminate,
//   }
// }
