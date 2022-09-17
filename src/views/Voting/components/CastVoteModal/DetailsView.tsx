import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Text, Box, HelpIcon, useTooltip, RocketIcon, Link } from '@plexswap/ui-plex'
import { useTranslation } from '@plexswap/localization'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { ModalInner, VotingBoxBorder, VotingBoxCardInner } from './styles'

const StyledLinkExternal = styled(LinkExternal)`
  display: inline-flex;
  font-size: 14px;
  > svg {
    width: 14px;
  }
`

const FixedTermWrapper = styled(Box)<{ expired?: boolean }>`
  width: 100%;
  margin: 16px 0;
  padding: 1px 1px 3px 1px;
  background: ${({ theme, expired }) => (expired ? theme.colors.warning : 'linear-gradient(180deg, #53dee9, #7645d9)')};
  border-radius: ${({ theme }) => theme.radii.default};
`

const FixedTermCardInner = styled(Box)<{ expired?: boolean }>`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme, expired }) => (expired ? 'rgba(255, 178, 55, 0.098)' : theme.colors.gradientCloudyday)};
  }
`

const StyleLink = styled(Link)`
  text-decoration: underline;
`

interface DetailsViewProps {
  total: number
  wayaBalance?: number
  wayaVaultBalance?: number
  wayaPoolBalance?: number
  poolsBalance?: number
  wayaBnbLpBalance?: number

  lockedWayaBalance?: number
  lockedEndTime?: number
  block: number
}

const DetailsView: React.FC<React.PropsWithChildren<DetailsViewProps>> = ({
  total,
  wayaBalance,
  wayaVaultBalance,
  wayaPoolBalance,
  poolsBalance,
  wayaBnbLpBalance,

  lockedWayaBalance,
  lockedEndTime,
  block,
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useCurrentBlockTimestamp()

  const isBoostingExpired = useMemo(() => {
    return lockedEndTime !== 0 && new BigNumber(blockTimestamp?.toString()).gte(lockedEndTime)
  }, [blockTimestamp, lockedEndTime])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      {Number.isFinite(lockedWayaBalance) && (
        <Box>
          <Text>
            {isBoostingExpired
              ? t(
                  'Your vWAYA boosting was expired at the snapshot block. Renew your fixed-term staking position to activate the boost for future voting proposals.',
                )
              : t(
                  'Voting power is calculated using the staking amount and remaining staking duration of the fixed-term WAYA staking position at the block.',
                )}
          </Text>
          <Text bold m="10px 0">
            {`${t('WAYA locked:')} ${formatNumber(lockedWayaBalance, 0, 2)}`}
          </Text>
          <StyleLink href="/pools">{t('Go to Pools')}</StyleLink>
        </Box>
      )}
    </>,
    {
      placement: 'bottom',
    },
  )

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of WAYA you held at the block detailed below. WAYA held in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBoxBorder>
        <VotingBoxCardInner>
          <Text color="secondary">{t('Your Voting Power')}</Text>
          <Text bold fontSize="20px">
            {formatNumber(total, 0, 3)}
          </Text>
        </VotingBoxCardInner>
      </VotingBoxBorder>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your voting power at block')}
        <StyledLinkExternal href={getBlockExploreLink(block, 'block')} ml="8px">
          {block}
        </StyledLinkExternal>
      </Text>
      {Number.isFinite(wayaBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Wallet')}
          </Text>
          <Text textAlign="right">{formatNumber(wayaBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wayaVaultBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Flexible WAYA Staking')}
          </Text>
          <Text textAlign="right">{formatNumber(wayaVaultBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wayaPoolBalance) && (
        <>
          {lockedWayaBalance === 0 ? (
            <Flex alignItems="center" justifyContent="space-between" mb="4px">
              <Flex>
                <Text color="textSubtle" fontSize="16px">
                  {t('Fixed Term WAYA Staking')}
                </Text>
                {tooltipVisible && tooltip}
                <Flex ref={targetRef}>
                  <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                </Flex>
              </Flex>
              <Text color="failure" textAlign="right">
                {formatNumber(wayaPoolBalance, 0, 3)}
              </Text>
            </Flex>
          ) : (
            <FixedTermWrapper expired={isBoostingExpired}>
              <FixedTermCardInner expired={isBoostingExpired}>
                <Flex>
                  <Text color="textSubtle" fontSize="16px" mr="auto">
                    {t('Fixed Term WAYA Staking')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <Flex ref={targetRef}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </Flex>
                </Flex>
                <Flex mt="10px" flexDirection="column" alignItems="flex-end">
                  <Text bold color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="16px">
                    {formatNumber(wayaPoolBalance, 0, 3)}
                  </Text>
                  <Flex>
                    <RocketIcon color={isBoostingExpired ? 'warning' : 'secondary'} width="15px" height="15px" />
                    <Text ml="4px" color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="12px">
                      {isBoostingExpired ? t('Boosting Expired') : t('Boosted by vWAYA')}
                    </Text>
                  </Flex>
                </Flex>
              </FixedTermCardInner>
            </FixedTermWrapper>
          )}
        </>
      )}
      {Number.isFinite(poolsBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Other Crop Silos')}
          </Text>
          <Text textAlign="right">{formatNumber(poolsBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wayaBnbLpBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('WAYA BNB LP')}
          </Text>
          <Text textAlign="right">{formatNumber(wayaBnbLpBalance, 0, 3)}</Text>
        </Flex>
      )}
    </ModalInner>
  )
}

export default DetailsView
