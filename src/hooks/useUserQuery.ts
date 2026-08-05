import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '../api/users';

export function useUserQuery(id: number | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: ({ signal }) => fetchUserById(id as number, signal),
    enabled: id !== undefined && Number.isFinite(id),
  });
}
