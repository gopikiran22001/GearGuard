import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

interface UseApiReturn<T, P extends any[]> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    execute: (...args: P) => Promise<T | null>;
    reset: () => void;
}

/**
 * Custom hook for API calls with loading, error, and data states
 * 
 * @param apiFunction - The API function to call
 * @param options - Configuration options
 * @returns Object with data, loading, error states and execute function
 * 
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => equipmentAPI.getAll(),
 *   { immediate: true }
 * );
 */
export function useApi<T, P extends any[] = []>(
    apiFunction: (...args: P) => Promise<T>,
    options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
    const { immediate = false, onSuccess, onError } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(
        async (...args: P): Promise<T | null> => {
            try {
                setLoading(true);
                setError(null);

                const result = await apiFunction(...args);
                setData(result);

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } catch (err: any) {
                const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
                setError(error);

                if (onError) {
                    onError(error);
                }

                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, onSuccess, onError]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate]);

    return { data, loading, error, execute, reset };
}
