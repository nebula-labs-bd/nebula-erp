import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createContact,
  deleteContact,
  getContactLedger,
  getContacts,
  updateContact,
} from "../services/contact.service";

import { contactKeys } from "../queries/contact.keys";

import type {
  Contact,
  ContactLedgerEntry,
  CreateContactInput,
  UpdateContactInput,
} from "../types/contact.types";

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.contacts(),
    queryFn: async () => {
      const response = await getContacts();
      return response.data;
    },
  });
}

export function useContactMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: contactKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createContact,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateContact,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteContact,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export function useContactLedger(contactId: string) {
  return useQuery({
    queryKey: contactKeys.ledger(contactId),
    queryFn: async () => {
      const response = await getContactLedger(contactId);
      return response.data;
    },
    enabled: !!contactId,
  });
}

export type {
  Contact,
  ContactLedgerEntry,
  CreateContactInput,
  UpdateContactInput,
};