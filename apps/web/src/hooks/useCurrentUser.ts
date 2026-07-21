import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../services/user.service";
import { queryKeys } from "../queries/queryKeys";

export default function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: getCurrentUser,
  });
}