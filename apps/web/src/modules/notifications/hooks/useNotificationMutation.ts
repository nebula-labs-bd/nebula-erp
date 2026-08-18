import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markNotificationRead,
} from "../services/notification.service";
import { notificationKeys } from "../queries/notification.keys";

import type { Notification } from "../types/notification.types";

/**
 * Mutation hook for the benign read-state toggle.
 *
 * On success it updates the cached notification list in place (marking the
 * target notification as read) and refetches the list — no underlying ERP
 * record is mutated.
 */
export function useNotificationMutation() {
  const queryClient = useQueryClient();

  const listKey = notificationKeys.list();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previous = queryClient.getQueryData<Notification[]>(listKey);

      queryClient.setQueryData<Notification[]>(listKey, (old) =>
        (old ?? []).map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
