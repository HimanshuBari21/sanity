import {TextWithTone, useRovingFocus} from '@sanity/base/components'
import {WarningOutlineIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack} from '@sanity/ui'
import React, {MouseEvent, useCallback, useState} from 'react'
import styled from 'styled-components'
import {Instructions} from './Instructions'
import {addSearchTerm} from './local-storage/search-store'
import {SearchResultItem} from './SearchResultItem'
import {useOmnisearch} from './state/OmnisearchContext'

interface SearchResultsProps {
  onRecentSearchClick?: () => void
}

export function SearchResults(props: SearchResultsProps) {
  const {onRecentSearchClick} = props

  const [focusRootElement, setFocusRootElement] = useState<HTMLDivElement | null>(null)

  const {
    dispatch,
    onClose,
    state: {terms, result},
  } = useOmnisearch()

  // Load next page and focus previous sibling
  const handleLoadMore = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      dispatch({type: 'PAGE_INCREMENT'})

      const previousSibling = event?.currentTarget?.previousElementSibling as HTMLElement
      if (previousSibling) {
        previousSibling.focus()
        previousSibling.setAttribute('aria-selected', 'true')
        previousSibling.setAttribute('tabIndex', '0')
      }
    },
    [dispatch]
  )

  const handleResultClick = useCallback(() => {
    addSearchTerm(terms)
    // setRecentSearches(getRecentSearchTerms(schema))
    onClose()
  }, [onClose, terms])

  // Enable keyboard arrow navigation
  useRovingFocus({
    direction: 'vertical',
    initialFocus: 'first',
    loop: false,
    rootElement: focusRootElement,
  })

  return (
    <SearchResultsWrapper loading={result.loading}>
      {result.error ? (
        <Flex align="center" direction="column" gap={3} marginY={2} padding={4}>
          <Box marginBottom={1}>
            <TextWithTone tone="critical">
              <WarningOutlineIcon />
            </TextWithTone>
          </Box>
          <TextWithTone size={2} tone="critical" weight="semibold">
            Something went wrong while searching
          </TextWithTone>
          <TextWithTone size={1} tone="critical">
            Please try again or check your connection
          </TextWithTone>
        </Flex>
      ) : (
        <>
          {!!result.hits.length && (
            // (Has search results)
            <Stack padding={1} ref={setFocusRootElement} space={1}>
              {result.hits.map((hit) => (
                <SearchResultItem key={hit.hit._id} hit={hit} onClick={handleResultClick} />
              ))}
              {result.hasMore && (
                <Button
                  disabled={result.loading}
                  mode="bleed"
                  onClick={handleLoadMore}
                  text="More"
                  title="Load more search results"
                />
              )}
            </Stack>
          )}

          {!result.hits.length && result.loaded && (
            // (No results)
            <Instructions />
          )}
        </>
      )}
    </SearchResultsWrapper>
  )
}

const SearchResultsWrapper = styled.div<{loading: boolean}>`
  opacity: ${(props) => (props.loading ? 0.5 : 1)};
  transition: 300ms opacity;
`
