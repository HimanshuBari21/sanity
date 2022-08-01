import {hues} from '@sanity/color'
import {CheckmarkIcon, SearchIcon} from '@sanity/icons'
import type {ObjectSchemaType} from '@sanity/types'
import {Box, Button, Card, Stack, Text, Theme} from '@sanity/ui'
import schema from 'part:@sanity/base/schema'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import styled, {css} from 'styled-components'
import {useSearchState} from '../contexts/search'
import {getSelectableTypes} from '../contexts/search/selectors'
import {useContainerArrowNavigation} from '../hooks/useContainerArrowNavigation'
import {CustomTextInput} from './CustomTextInput'

interface TypeFiltersProps {
  small?: boolean
}

export function TypeFilters({small}: TypeFiltersProps) {
  const childContainerRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const [typeFilter, setTypeFilter] = useState('')
  const {
    dispatch,
    state: {
      terms: {types: selectedTypes},
    },
  } = useSearchState()

  const allDocumentTypes = useMemo(() => getSelectableTypes(schema, ''), [])
  const displayFilterInput = useMemo(() => allDocumentTypes.length >= 10, [allDocumentTypes])
  const selectableDocumentTypes = useMemo(() => getSelectableTypes(schema, typeFilter), [
    typeFilter,
  ])

  const handleClearTypes = useCallback(() => dispatch({type: 'TERMS_TYPES_CLEAR'}), [dispatch])
  const handleFilterChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => setTypeFilter(e.currentTarget.value),
    [setTypeFilter]
  )
  const handleFilterClear = useCallback(() => setTypeFilter(''), [])

  useContainerArrowNavigation({childContainerRef, containerRef: textInputRef}, [typeFilter])

  return (
    <>
      {/* Search header */}
      <StickyCard $anchor="top" paddingX={small ? 1 : 2} paddingTop={small ? 1 : 2} tone="inherit">
        {displayFilterInput && (
          <CustomTextInput
            backgroundTone={small ? 'darker' : 'dark'}
            border={false}
            clearButton={!!typeFilter}
            fontSize={small ? 1 : 2}
            icon={SearchIcon}
            muted
            onChange={handleFilterChange}
            onClear={handleFilterClear}
            placeholder="Document type"
            ref={textInputRef}
            smallClearButton
            radius={2}
            value={typeFilter}
          />
        )}
      </StickyCard>

      <Card
        paddingBottom={1}
        paddingTop={displayFilterInput ? 1 : 0}
        paddingX={small ? 1 : 2}
        tone="inherit"
      >
        {/* Selectable document types */}
        <Stack ref={childContainerRef} space={1}>
          {selectableDocumentTypes.map((type) => (
            <TypeItem
              key={type.name}
              selected={selectedTypes.includes(type)}
              small={small}
              type={type}
            />
          ))}
        </Stack>

        {/* No results */}
        {!selectableDocumentTypes.length && (
          <Box padding={3}>
            <Text muted size={small ? 1 : 2} textOverflow="ellipsis">
              No matches for '{typeFilter}'.
            </Text>
          </Box>
        )}
      </Card>

      {/* Clear button */}
      {!typeFilter && selectedTypes.length > 0 && (
        <StickyCard
          $anchor="bottom"
          paddingBottom={small ? 1 : 2}
          paddingX={small ? 1 : 2}
          tone="inherit"
        >
          <Stack space={small ? 1 : 2}>
            <Box style={{borderBottom: `1px solid ${hues.gray[200].hex}`}} />
            <Button
              data-name="type-filter-button"
              disabled={selectedTypes.length === 0}
              fontSize={small ? 1 : 2}
              mode="bleed"
              onClick={handleClearTypes}
              // padding={small ? 3 : 4}
              padding={3}
              text="Clear"
              tone="primary"
            />
          </Stack>
        </StickyCard>
      )}
    </>
  )
}

function TypeItem({
  selected,
  small,
  type,
}: {
  selected: boolean
  small?: boolean
  type: ObjectSchemaType
}) {
  const {dispatch} = useSearchState()

  const handleAddType = useCallback(() => {
    dispatch({type: 'TERMS_TYPE_ADD', schemaType: type})
  }, [dispatch, type])

  const handleRemoveType = useCallback(() => {
    dispatch({type: 'TERMS_TYPE_REMOVE', schemaType: type})
  }, [dispatch, type])

  return (
    <TypeItemButton
      fontSize={small ? 1 : 2}
      iconRight={selected && CheckmarkIcon}
      justify="flex-start"
      key={type.title ?? type.name}
      mode="bleed"
      onClick={selected ? handleRemoveType : handleAddType}
      selected={selected}
      text={type.title ?? type.name}
      tone={selected ? 'primary' : 'default'}
    />
  )
}

const StickyCard = styled(Card)<{$anchor: 'bottom' | 'top'}>(({$anchor}) => {
  return css`
    position: sticky;
    z-index: 1;

    ${$anchor === 'bottom' &&
    css`
      bottom: 0;
    `}

    ${$anchor === 'top' &&
    css`
      top: 0;
    `}
  `
})

const TypeItemButton = styled(Button)(({theme}: {theme: Theme}) => {
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
      // Disable box-shadow to hide the the halo effect when we have keyboard focus over a selected <Button>
      // TODO: see if there's a better way to address this
      box-shadow: none;
    }
  `
})
