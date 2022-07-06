import React, {useCallback, useMemo, useRef, useState} from 'react'
import styled from 'styled-components'
import {SchemaType} from '@sanity/types'
import schema from 'part:@sanity/base/schema'
import {SearchIcon} from '@sanity/icons'
import {Button, Card, Flex, Menu, MenuDivider, MenuItem, Text, TextInput} from '@sanity/ui'
import {CheckedSquareIcon, UncheckedSquareIcon} from './Icons'
import {useSearchDispatch, useSearchState} from './state/SearchContext'
import {getSelectableTypes} from './state/search-reducer'

const TypeMenu = styled(Menu)`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 80px);
  width: 250px;
`

export function TypeFilter() {
  const [typeFilter, setTypeFilter] = useState('')
  const dispatch = useSearchDispatch()
  const {schemas: selectedTypes} = useSearchState()

  const documentTypes = useMemo(() => getSelectableTypes(schema, selectedTypes, typeFilter), [
    typeFilter,
    selectedTypes,
  ])

  const clearTypes = useCallback(() => dispatch({type: 'CLEAR_SCHEMAS'}), [dispatch])

  const filterChanged = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => setTypeFilter(e.currentTarget.value),
    [setTypeFilter]
  )

  return (
    <Card tone="primary">
      <TypeMenu space={2}>
        <TextInput
          icon={SearchIcon}
          placeholder="Search types"
          muted
          value={typeFilter}
          onChange={filterChanged}
        />
        {selectedTypes.map((type) => (
          <TypeItem key={type.name} selected type={type} />
        ))}
        {selectedTypes.length > 0 && (
          <>
            <Button
              mode="bleed"
              text="Clear"
              tone="primary"
              fontSize={1}
              padding={2}
              onClick={clearTypes}
              disabled={selectedTypes.length === 0}
              data-name="type-filter-button"
            />
            <MenuDivider />
          </>
        )}
        {documentTypes.map((type) => (
          <TypeItem key={type.name} selected={false} type={type} />
        ))}
        {!documentTypes.length && (
          <Card>
            <Text muted size={1}>
              No types matches '{typeFilter}'.
            </Text>
          </Card>
        )}
      </TypeMenu>
    </Card>
  )
}

function TypeItem(props: {selected: boolean; type: SchemaType}) {
  const {selected, type} = props
  const dispatch = useSearchDispatch()
  const ref = useRef<HTMLDivElement>()

  const focusSibling = useCallback(() => {
    const current = ref.current
    const sibling = current?.nextSibling ?? current.previousSibling
    if (sibling && 'focus' in sibling) {
      requestAnimationFrame(() => (sibling as HTMLElement)?.focus())
    }
  }, [])

  const selectType = useCallback(() => {
    dispatch({type: 'ADD_SCHEMA', schema: type})
    focusSibling()
  }, [dispatch, type, focusSibling])

  const unselectType = useCallback(() => {
    dispatch({type: 'REMOVE_SCHEMA', schema: type})
    focusSibling()
  }, [dispatch, type, focusSibling])

  const action = selected ? unselectType : selectType

  return (
    <MenuItem key={type.title ?? type.name} onClick={action} ref={ref}>
      <Flex gap={3}>
        <Text size={1} muted>
          {selected ? <CheckedSquareIcon /> : <UncheckedSquareIcon />}
        </Text>

        <Text size={2} textOverflow="ellipsis">
          {type.title ?? type.name}
        </Text>
      </Flex>
    </MenuItem>
  )
}
