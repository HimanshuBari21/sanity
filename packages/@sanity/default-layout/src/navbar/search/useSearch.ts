// @todo: remove the following line when part imports has been removed from this file
///<reference types="@sanity/types/parts" />

import {useState, useCallback} from 'react'
import {useObservableCallback} from 'react-rx'
import {
  distinctUntilChanged,
  catchError,
  map,
  switchMap,
  tap,
  filter,
  scan,
  mergeMapTo,
} from 'rxjs/operators'
import {concat, EMPTY, Observable, of, timer} from 'rxjs'
import search from 'part:@sanity/base/search'
import type {SearchParams} from '@sanity/base'
import {SearchHit, SearchState} from './types'

type SearchFunction = (params: SearchParams) => Observable<SearchHit[]>

const INITIAL_SEARCH_STATE: SearchState = {
  hits: [],
  loading: false,
  error: null,
  query: '',
  schemas: [],
}

function nonNullable<T>(v: T): v is NonNullable<T> {
  return v !== null
}

export function useSearch(
  initialState = INITIAL_SEARCH_STATE
): {
  handleSearch: (params: string | SearchParams) => void
  handleClearSearch: () => void
  searchState: SearchState
} {
  const [searchState, setSearchState] = useState(initialState)

  const onSearch: SearchFunction = useCallback((params) => {
    return params.query === '' && !params.schemas.length ? of([]) : search(params)
  }, [])

  const handleQueryChange = useObservableCallback(
    (inputValue$: Observable<SearchParams | null>) => {
      return inputValue$.pipe(
        distinctUntilChanged(),
        filter(nonNullable),
        switchMap((params) =>
          concat(
            of({...INITIAL_SEARCH_STATE, loading: true, ...params}),
            timer(100).pipe(mergeMapTo(EMPTY)),
            onSearch(params).pipe(
              map((hits) => ({hits})),
              catchError((error) => {
                return of({
                  ...INITIAL_SEARCH_STATE,
                  error: error,
                  loading: false,
                  ...params,
                })
              })
            ),
            of({loading: false})
          )
        ),
        scan((prevState, nextState): SearchState => {
          return {...prevState, ...nextState}
        }, INITIAL_SEARCH_STATE),
        tap(setSearchState)
      )
    },
    []
  )

  const handleClearSearch = useCallback(() => {
    setSearchState(INITIAL_SEARCH_STATE)
    handleQueryChange(INITIAL_SEARCH_STATE) // cancel current request
  }, [handleQueryChange])

  const handleSearch = useCallback(
    (params: string | SearchParams) =>
      handleQueryChange(typeof params === 'string' ? {query: params, schemas: []} : params),
    [handleQueryChange]
  )

  return {handleSearch, handleClearSearch, searchState}
}
