import * as React from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent, {
  timelineContentClasses,
} from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { format, parseISO } from 'date-fns'
import { Box, Chip } from '@mui/material'
import { get } from 'http'
import { Order } from '../../Types/dbtypes'
import { ChipColor } from '../../Types/muiTypes'
import { getStatusIconInfo } from '../../utils/magentoHelpers'

type CommentsProps = {
  comments: Order['comments']
}

function getCommentVisibilityInfo(comment: Order['comments'][0]) {
  let notifiedIcon
  let visibleIcon
  if (comment.customerNotified) {
    notifiedIcon = (
      <MarkEmailReadOutlinedIcon
        color="success"
        fontSize="small"
        sx={{ ml: 1 }}
        titleAccess="customer notified"
      />
    )
  } else {
    notifiedIcon = (
      <CloseOutlinedIcon
        color="error"
        fontSize="small"
        sx={{ ml: 1 }}
        titleAccess="customer not notified"
      />
    )
  }
  if (comment.visibleOnFront) {
    visibleIcon = (
      <VisibilityOutlinedIcon
        color="success"
        fontSize="small"
        sx={{ ml: 1 }}
        titleAccess="visible on front end"
      />
    )
  } else {
    visibleIcon = (
      <VisibilityOffOutlinedIcon
        color="error"
        fontSize="small"
        sx={{ ml: 1 }}
        titleAccess="not visible on front end"
      />
    )
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ userSelect: 'none' }}
    >
      <Chip
        {...getStatusIconInfo(comment.status)}
        size="small"
        variant="outlined"
      />
      {notifiedIcon}
      {visibleIcon}
    </Box>
  )
}

function getCommentTypeIconInfo(comment: Order['comments'][0]): {
  color: 'info' | 'secondary' | 'warning' | 'error'
  label: string
} {
  let chipColor: ChipColor
  let label: string

  if (comment.type === undefined) {
    return { color: 'warning', label: 'unknown' }
  }
  // 'shipment' | 'order' | 'invoice' | 'creditmemo'
  switch (comment.type) {
    case 'order':
      label = 'order'
      chipColor = 'info'
      break
    case 'shipment':
      label = 'shipment'
      chipColor = 'secondary'
      break
    case 'invoice':
      label = 'invoice'
      chipColor = 'warning'
      break
    case 'creditmemo':
      label = 'refund'
      chipColor = 'error'
      break
    default:
      label = 'unknown'
      chipColor = 'warning'
  }

  return { color: chipColor, label }
}

export default function Comments({ comments }: CommentsProps) {
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          maxWidth: 120,
          minWidth: 120,
          width: 120,
          textAlign: 'left',
          pl: 0,
        },
        [`& .${timelineContentClasses.root}`]: {
          pr: 0,
        },
        maxWidth: 840,
      }}
    >
      {comments.map((comment, index) => (
        <TimelineItem key={comment.id || comment.externalId}>
          <TimelineOppositeContent color="textSecondary" variant="h6">
            {comment.createdAt
              ? format(
                  typeof comment.createdAt === 'string'
                    ? parseISO(comment.createdAt)
                    : comment.createdAt,
                  'dd MMM yyyy'
                )
              : 'some day'}
            <Chip
              size="small"
              variant="outlined"
              sx={{ userSelect: 'none' }}
              {...getCommentTypeIconInfo(comment)}
            />
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color={getCommentTypeIconInfo(comment).color} />
            {index !== comments.length - 1 && (
              <TimelineConnector
                color={getCommentTypeIconInfo(comment).color}
              />
            )}
          </TimelineSeparator>
          <TimelineContent
            variant="body2"
            sx={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}
          >
            {getCommentVisibilityInfo(comment)}
            {comment.comment}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
