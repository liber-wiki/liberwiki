import _ from 'lodash'

import { paths } from '@/api/schema'
import type { APIQuery, APIType, RemainingUseQueryOptions } from '@/api/typeHelpers'
import config from '@/config/config'
import { getLazyValue } from '@/lib/utils'

import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import createClient, { FetchResponse } from 'openapi-fetch'
import type { MediaType } from 'openapi-typescript-helpers'

export class AcikSozlukApi {
  config = config.api
  bearerToken: string | null | (() => string | null)

  constructor(bearerToken: typeof this.bearerToken) {
    this.bearerToken = bearerToken
  }

  useQueryClient = useQueryClient

  public isAuthenticated(): boolean {
    return !!getLazyValue<string | null>(this.bearerToken)
  }

  fetchWrapper = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const bearerToken = getLazyValue<string | null>(this.bearerToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    if (bearerToken) {
      init.headers[config.api.bearerTokenHeaderName] = `${config.api.bearerTokenPrefix} ${bearerToken}`
    }
    init.headers['Content-Type'] = 'application/json'

    try {
      return await fetch(input, init)
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: `${error}`,
        }),
        {
          status: 500,
          statusText: 'Network Error',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: this.config.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetchWrapper,
  })

  private processQueryResult<T, O, M extends MediaType>(queryResult: UseQueryResult<FetchResponse<T, O, M>>) {
    return {
      data: queryResult?.data?.data,
      response: queryResult?.data?.response,
      ..._.omit(queryResult, 'data'),
    }
  }

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }

  // Below this are api endpoint wrappers
  // In this order:
  // auth
  // users
  // titles
  // entries
  public obtainAuthToken = () => {
    return useMutation({
      mutationKey: ['obtainAuthToken'],
      mutationFn: (data: APIType<'AuthTokenRequest'>) => this.client.POST('/api/v0/auth/tokens/', { body: data }),
    })
  }

  public deleteAuthToken = () => {
    return useMutation({
      mutationKey: ['deleteAuthToken'],
      mutationFn: () => this.client.DELETE('/api/v0/auth/tokens/'),
    })
  }

  public signup = () => {
    return useMutation({
      mutationKey: ['signup'],
      mutationFn: (data: APIType<'SignupRequest'>) => this.client.POST('/api/v0/auth/signup/', { body: data }),
    })
  }

  public users = (
    filters?: APIQuery<'/api/v0/users/'>,
    useQueryOptions?: RemainingUseQueryOptions<'/api/v0/users/'>
  ) => {
    const queryResult = useQuery({
      queryKey: ['users', filters],
      queryFn: () => this.client.GET('/api/v0/users/', { params: { query: filters } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public user = (id: string, useQueryOptions?: RemainingUseQueryOptions<'/api/v0/users/{id}/'>) => {
    const queryResult = useQuery({
      queryKey: ['user', id],
      queryFn: () => this.client.GET(`/api/v0/users/{id}/`, { params: { path: { id } } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public me = (useQueryOptions?: RemainingUseQueryOptions<'/api/v0/users/me/'>) => {
    const queryResult = useQuery({
      queryKey: ['me'],
      queryFn: () => this.client.GET('/api/v0/users/me/'),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public putMe = () => {
    return useMutation({
      mutationKey: ['putMe'],
      mutationFn: (data: APIType<'UserRequest'>) => this.client.PUT('/api/v0/users/me/', { body: data }),
    })
  }

  public patchMe = () => {
    return useMutation({
      mutationKey: ['patchMe'],
      mutationFn: (data: APIType<'PatchedUserRequest'>) => this.client.PATCH('/api/v0/users/me/', { body: data }),
    })
  }

  public titles = (
    filters?: APIQuery<'/api/v0/titles/'>,
    useQueryOptions?: RemainingUseQueryOptions<'/api/v0/titles/'>
  ) => {
    const queryResult = useQuery({
      queryKey: ['titles', filters],
      queryFn: () => this.client.GET('/api/v0/titles/', { params: { query: filters } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public title = (id: string, useQueryOptions?: RemainingUseQueryOptions<'/api/v0/titles/{id}/'>) => {
    const queryResult = useQuery({
      queryKey: ['title', id],
      queryFn: () => this.client.GET(`/api/v0/titles/{id}/`, { params: { path: { id } } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public createTitle = () => {
    return useMutation({
      mutationKey: ['createTitle'],
      mutationFn: (data: APIType<'TitleRequest'>) => this.client.POST('/api/v0/titles/', { body: data }),
    })
  }

  public deleteTitle = (id: string) => {
    return useMutation({
      mutationKey: ['deleteTitle', id],
      mutationFn: () => this.client.DELETE(`/api/v0/titles/{id}/`, { params: { path: { id } } }),
    })
  }

  public entries = (
    filters?: APIQuery<'/api/v0/entries/'>,
    useQueryOptions?: RemainingUseQueryOptions<'/api/v0/entries/'>
  ) => {
    const queryResult = useQuery({
      queryKey: ['entries', filters],
      queryFn: () => this.client.GET('/api/v0/entries/', { params: { query: filters } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public entry = (id: string, useQueryOptions?: RemainingUseQueryOptions<'/api/v0/entries/{id}/'>) => {
    const queryResult = useQuery({
      queryKey: ['entry', id],
      queryFn: () => this.client.GET(`/api/v0/entries/{id}/`, { params: { path: { id } } }),
      ...useQueryOptions,
    })
    return this.processQueryResult(queryResult)
  }

  public createEntry = () => {
    return useMutation({
      mutationKey: ['createEntry'],
      mutationFn: (data: APIType<'EntryRequest'>) => this.client.POST('/api/v0/entries/', { body: data }),
    })
  }

  public putEntry = (id: string) => {
    return useMutation({
      mutationKey: ['putEntry', id],
      mutationFn: (data: APIType<'EntryRequest'>) =>
        this.client.PUT(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data }),
    })
  }

  public patchEntry = (id: string) => {
    return useMutation({
      mutationKey: ['patchEntry', id],
      mutationFn: (data: APIType<'PatchedEntryUpdateRequest'>) =>
        this.client.PATCH(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data }),
    })
  }

  public deleteEntry = (id: string) => {
    return useMutation({
      mutationKey: ['deleteEntry', id],
      mutationFn: () => this.client.DELETE(`/api/v0/entries/{id}/`, { params: { path: { id } } }),
    })
  }
}