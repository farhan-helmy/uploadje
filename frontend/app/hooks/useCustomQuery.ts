import { useSearchParams } from '@remix-run/react';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

// This is a custom useQuery with defaults, it is a client-side fetching utility
// aims to replicate remix's loader behaviour, e.g. invalidating on
// urlSearchParams change. Other than that it includes the default useQuery
// config we'll be using globally
function useCustomQuery<TData = unknown, TError = Error>({
  queryKey, ...opts
}: UndefinedInitialDataOptions<TData, TError>) {
  const [searchParams] = useSearchParams();

  const queryKeyWithDefault =
    [ ...(queryKey ?? []), searchParams.toString()];

  return useQuery<TData, TError>({
    placeholderData: keepPreviousData,
    queryKey: queryKeyWithDefault,
    ...opts,
  });
}

export { useCustomQuery };
