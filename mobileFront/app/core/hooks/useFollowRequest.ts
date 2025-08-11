// core/hooks/useMarkFollowRequested.ts
import { useAppDispatch, useAppStore } from "../../store/hooks";
import { MemoryApi } from "../../lib/APIs/RTKQuery/memoryApi";
import type { Memory } from "../../core/types/memory";

export function useMarkFollowRequested() {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  return (targetUserId: string, requested: boolean) => {
    const state = store.getState() as any;
    const memoryApiState = state.MemoryApi;

    if (!memoryApiState?.queries) return;

    // Loop over all active queries in MemoryApi
    Object.keys(memoryApiState.queries).forEach((queryKey) => {
      const query = memoryApiState.queries[queryKey];
      if (query?.data && Array.isArray(query.data)) {
        const updatedData = query.data.map((memory: Memory) =>
          memory.userInfo?.user_id === targetUserId
            ? { ...memory, is_requested: requested }
            : memory
        );
        console.log('updatedData', updatedData);
        dispatch(
          MemoryApi.util.updateQueryData(
            query.endpointName as any,
            query.originalArgs,
            (draft: any) => {
                for (const m of draft) {
                  if (m.userInfo?.user_id === targetUserId) {
                    m.is_requested = requested; 
                  }
                }
              }
          )
        );
      }
    });
  };
}
