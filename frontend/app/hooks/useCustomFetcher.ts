import { useFetcher } from '@remix-run/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useEffect,
  useMemo,
  useState
} from 'react';

export interface CustomFetcherProps {
  onError?: ()=>void;
  onMutate?: ()=>void;
  onSettled?: ()=>void;
  onSuccess?: ()=>void;
  useErrorBoundary?: (error: Error) => boolean;
  meta?: Record<string, unknown>;
}

// Remix's useFetcher is used for mutations, and by default it invalidates the
// current route loader. For client-side fetch we need to handle manually. The
// goal for this hook is to replicate the useFetcher's behavior for invalidating
// the current route data.

export function useCustomFetcher({
  onError,
  onMutate,
  onSettled,
  onSuccess,
  // useErrorBoundary,
  // meta
}: CustomFetcherProps) {
  const fetcher = useFetcher<{ error: boolean }>();
  const queryClient = useQueryClient();
  const { data, state } = fetcher;
  const [error, setError] = useState<any>(null);
  const [isError, setIsError] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const isLoading = useMemo(()=>state === 'submitting', [state]);
  const isIdle = useMemo(()=>state === 'idle', [state]);
  const status = useMemo(()=>state, [state]);

  useEffect(()=>{
    if (state === 'loading')
      return;
    if (state==='submitting') {
      if (onMutate) onMutate();
      return;
    }
    if (!data)
      return;
    if (data?.error) {
      setError(data.error);
      setIsSuccess(false);
      setIsError(true);

      if (onError) onError();

    } else {
      setError(null);
      setIsError(false);
      setIsSuccess(true);

      if (onSuccess) onSuccess();

      queryClient.invalidateQueries();
    }
    if (onSettled) onSettled();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    fetcher,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    status,
  };
}
