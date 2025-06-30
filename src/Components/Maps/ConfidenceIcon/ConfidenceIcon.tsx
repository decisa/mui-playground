import VerifiedIcon from '@mui/icons-material/Verified'
import { NewReleases as IssuesIcon } from '@mui/icons-material'
import { ConfidenceLevel } from '../utils'

export default function ConfidenceIcon({
  confidence,
}: {
  confidence: ConfidenceLevel
}) {
  const confidentValues: ConfidenceLevel[] = ['high', 'exact']

  return confidentValues.includes(confidence) ? (
    <VerifiedIcon
      color="primary"
      fontSize="small"
      sx={{ ml: 1 }}
      titleAccess={confidence}
    />
  ) : (
    <IssuesIcon
      color="error"
      fontSize="small"
      sx={{ ml: 1 }}
      titleAccess="customer not notified"
    />
  )
}
