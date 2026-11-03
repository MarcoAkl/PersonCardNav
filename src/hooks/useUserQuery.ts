import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../offline/usersRepository';

export function useUserQuery(id: number | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: ({ signal }) => getUserById(id as number, signal),
    enabled: id !== undefined && Number.isFinite(id),
  });
}
