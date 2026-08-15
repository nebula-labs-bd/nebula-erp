import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  postJournalEntry,
  updateJournalEntry,
} from "../services/accounting.service";

import { accountingKeys } from "../queries/accounting.keys";

import type {
  CreateJournalEntryInput,
  JournalEntry,
  UpdateJournalEntryInput,
} from "../types/accounting.types";

export function useJournalEntries() {
  return useQuery({
    queryKey: accountingKeys.journalEntries(),
    queryFn: async () => {
      const response = await getJournalEntries();
      return response.data;
    },
  });
}

export function useJournalMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createJournalEntry,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateJournalEntry,
    onSuccess: refresh,
  });

  const post = useMutation({
    mutationFn: postJournalEntry,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    post,
    remove,
  };
}

export type {
  CreateJournalEntryInput,
  JournalEntry,
  UpdateJournalEntryInput,
};