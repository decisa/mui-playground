import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import AddCommentForm from './AddCommentForm'
import { OrderStatus } from '../../Types/magentoTypes'
import { OrderCommentCreate } from '../../Types/dbtypes'

const tabNames = ['add comment', 'shipments', 'payments'] as const
type TabName = (typeof tabNames)[number]

const tabProps = tabNames.map((name: TabName, index) => ({
  key: name,
  index,
  label: name,
  id: `tab-${name.replace(' ', '-')}`,
  'aria-controls': `tabpanel-${name.replace(' ', '-')}`,
}))

type TabPanelProps = {
  children?: React.ReactNode
  name: TabName
  index: number
  value: number
}
function TabPanel({
  children,
  name,
  index,
  value: selectedTab,
}: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={index !== selectedTab}
      id={`tabpanel-${name.replace(' ', '-')}`}
      aria-labelledby={`tab-${name.replace(' ', '-')}`}
      sx={{ p: 2 }}
    >
      {index === selectedTab && <Box>{children}</Box>}
    </Box>
  )
}

type CommentsEditorProps = {
  orderStatus: OrderStatus
  orderId: number
  addNewComment: (comment: OrderCommentCreate) => void
  refreshComments: () => void
}

export default function CommentsEditor({
  orderStatus,
  orderId,
  addNewComment,
  refreshComments,
}: CommentsEditorProps) {
  const [selectedTab, setSelectedTab] = React.useState(0)

  const handleTabSelection = (event: React.SyntheticEvent, index: number) => {
    setSelectedTab(index)
  }

  return (
    <Box sx={{ width: '100%' }} className="no-print">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabSelection}
          aria-label="comments editor tabs"
        >
          {tabProps.map((tabProp) => (
            <Tab {...tabProp} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} name={tabNames[0]} index={0}>
        <AddCommentForm
          orderStatus={orderStatus}
          orderId={orderId}
          addNewComment={addNewComment}
          refreshComments={refreshComments}
        />
      </TabPanel>
      <TabPanel value={selectedTab} name={tabNames[1]} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={selectedTab} name={tabNames[2]} index={2}>
        Item Three
      </TabPanel>
    </Box>
  )
}
