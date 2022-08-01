import {ClockIcon, CloseIcon} from '@sanity/icons'
import {Box, Button, Flex, Text, Theme} from '@sanity/ui'
import React, {MouseEvent, useCallback} from 'react'
import styled, {css} from 'styled-components'
import {RecentSearch} from '../datastores/recentSearches'
import {TypePills} from './TypePills'

export interface RecentSearchesProps {
  value: RecentSearch
  onClick: (value: RecentSearch) => void
  onDelete: (event: MouseEvent) => void
}

export function RecentSearchItem(props: RecentSearchesProps) {
  const {value, onClick, onDelete} = props
  const handleRecentSearchClick = useCallback(() => {
    onClick(value)
  }, [value, onClick])

  const typesSelected = value.types.length > 0

  return (
    <RecentSearchItemWrapper
      mode="bleed"
      onClick={handleRecentSearchClick}
      paddingLeft={3}
      paddingRight={1}
      paddingY={1}
      style={{width: '100%'}}
    >
      <Flex align="center">
        <Box paddingY={2}>
          <Text size={2}>
            <ClockIcon />
          </Text>
        </Box>
        <Flex align="center" flex={1} gap={3} marginLeft={3}>
          {value.query && (
            <Box marginLeft={1} style={{flexShrink: 0}}>
              <Text>{value.query}</Text>
            </Box>
          )}
          {typesSelected && <TypePills types={value.types} />}
        </Flex>

        {/* TODO: this is neither semantic nor accessible, consider revising */}
        <CloseButton onClick={onDelete}>
          <Flex padding={2}>
            <Text size={1}>
              <CloseIcon />
            </Text>
          </Flex>
        </CloseButton>
      </Flex>
    </RecentSearchItemWrapper>
  )
}

const RecentSearchItemWrapper = styled(Button)(({theme}: {theme: Theme}) => {
  const {color} = theme.sanity
  // TODO: use idiomatic sanity/ui styling, double check usage of `bg2`
  return css`
    // Sanity UI <Button> elements will automatically focus on any keypress _after_ it's been clicked.
    // Since we don't want these buttons to ever have focus, we currently mask this.
    // TODO: see if there's a better way to address this
    &:focus {
      box-shadow: none !important;
    }
    &[aria-selected='true'] {
      background: ${color.button.bleed.default.hovered.bg2};
    }
  `
})

const CloseButton = styled.div`
  opacity: 0.5;
  visibility: hidden;

  ${RecentSearchItemWrapper}:hover & {
    visibility: visible;
  }

  &:hover {
    opacity: 1;
  }
`
