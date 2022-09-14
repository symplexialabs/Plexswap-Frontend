import styled from 'styled-components'
import { Tag, Flex, Heading, Skeleton } from '@plexswap/ui-plex'
import { Token } from '@plexswap/sdk'
import { CoreTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'
import BoostedTag from '../YieldBooster/components/BoostedTag'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  token: Token
  quoteToken: Token
  boosted?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  lpLabel,
  multiplier,
  token,
  quoteToken,
  boosted,
}) => {
  const isReady = multiplier !== undefined

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {isReady ? (
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      ) : (
        <Skeleton mr="8px" width={63} height={63} variant="circle" />
      )}
      <Flex flexDirection="column" alignItems="flex-end">
        {isReady ? <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading> : <Skeleton mb="4px" width={60} height={18} />}
        <Flex justifyContent="center">
          <CoreTag />
          {boosted && <BoostedTag ml="4px" />}
          {multiplier ? (
            <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
