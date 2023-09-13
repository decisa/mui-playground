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
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { format, parseISO } from 'date-fns'
import { Box, Chip, Typography, useTheme } from '@mui/material'
import { Order } from '../../Types/dbtypes'
import { ChipColor } from '../../Types/muiTypes'
import { getStatusIconInfo } from '../../utils/magentoHelpers'
import { tokens } from '../../theme'
import type { ColorPalette } from '../../theme'

type CommentsProps = {
  comments: Order['comments']
}

const wordsToHighlight = [
  'balance',
  'credit',
  'deposit',
  'payment',
  'paid in full',
  'refund',
]
// helper function that highlights given words in a string
function highlightWords(
  text: string | null,
  words: string[],
  colors: ColorPalette
) {
  // regular expression pattern to match the price variants
  const pricePattern = /\$\d{1,3}(?:,?\d{3})*(?:\.\d{2})?(?![\d/])/g

  // C regular expression pattern to match the splitters stored in words
  const splitterPattern = new RegExp(
    words.map((word) => `\\b${word}\\b`).join('|'),
    'gi'
  )

  // replace 9+ dashes with hr
  const dashPattern = /(-{9,})(?:\s*)/g

  // Combine the price pattern and the splitter pattern
  const regexPattern = new RegExp(
    `(${pricePattern.source})|(${splitterPattern.source})|(${dashPattern.source})`,
    'gi'
  )

  // Split the text using the combined regular expression
  // console.log('processing comments:', text, typeof text)
  const parts = text ? text.split(regexPattern).filter((part) => part) : ['']

  const highlighted = parts.length > 1
  const parsedComment = (
    <>
      {parts.map((part, i) => {
        const key = `${part}-${i}`
        if (part && part.match(dashPattern)) {
          return (
            <hr
              key={key}
              style={{
                marginTop: 0,
                height: '2px',
                backgroundColor: colors.blueAccent[200],
                border: 'none',
              }}
            />
          )
        }
        if (part && part.match(/paid in full/i)) {
          return (
            <Typography
              variant="body2"
              component="span"
              key={key}
              sx={{
                // backgroundColor: 'success.light',
                fontWeight: 'bold',
                // color: 'white',
                // borderRadius: '3px',
                // px: 1,
                // paddingBottom: '2px',
                color: 'success.light',
                textDecoration: 'underline',
              }}
            >
              {part}
            </Typography>
          )
        }
        if (part && part.match(regexPattern)) {
          return (
            <Typography
              variant="body2"
              component="span"
              key={key}
              sx={{ color: 'info.main', fontWeight: 'bold' }}
            >
              {part}
            </Typography>
          )
        }

        if (part === '') {
          return (
            <Typography
              variant="body2"
              component="span"
              key={key}
              sx={{ opacity: 0.4, userSelect: 'none' }}
            >
              empty comment
            </Typography>
          )
        }
        return (
          <Typography variant="body2" component="span" key={key}>
            {part}
          </Typography>
        )
      })}
    </>
  )

  return { comment: parsedComment, highlighted }
}

function getCommentVisibilityInfo(comment: {
  visibleOnFront: boolean
  customerNotified: boolean
  status: string
}) {
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

function getCommentTypeIconInfo(comment: { type?: string }): {
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
  // use the MUI theme and colors
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  // highlight words in comments
  type HighlightedComment = {
    id: number
    comment: React.ReactNode
    createdAt: string
    type: string
    visibleOnFront: boolean
    customerNotified: boolean
    status: string
    highlighted: boolean
  }
  const highlightedComments: HighlightedComment[] = comments.map(
    (commentData) => {
      const {
        id,
        externalId,
        comment,
        createdAt,
        type,
        status,
        visibleOnFront,
        customerNotified,
      } = commentData
      // let highlighted = false
      // let parsedComment: React.ReactNode = comment
      // if (commentData.comment) {
      //   highlighted = true
      //   parsedComment = highlightWords(commentData.comment, wordsToHighlight)
      // }

      const parsedCreatedAt = createdAt
        ? format(
            typeof createdAt === 'string' ? parseISO(createdAt) : createdAt,
            'dd MMM yyyy'
          )
        : 'some day'

      return {
        id: id || externalId || 0,
        createdAt: parsedCreatedAt,
        type,
        visibleOnFront,
        customerNotified,
        status,
        ...highlightWords(comment, wordsToHighlight, colors),
      }
    }
  )
  // console.log(highlightedComments)
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
        px: 0,
      }}
    >
      {highlightedComments.map((comment, index) => (
        <TimelineItem
          key={comment.id}
          sx={{
            px: 2,
            backgroundColor: comment.highlighted
              ? colors.background[50]
              : undefined,
          }}
        >
          <TimelineOppositeContent color="textSecondary" variant="h6">
            {comment.createdAt}
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
