import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Role } from '../api/types';
import { ApiError, type SortField, type SortOrder } from '../api/users';
import { useUsersQuery } from '../hooks/useUsersQuery';
import { SearchBar } from '../components/Controls/SearchBar';
import { RoleFilterSelect } from '../components/Controls/RoleFilterSelect';
import { SortControl } from '../components/Controls/SortControl';
import { PersonGrid } from '../components/PersonGrid/PersonGrid';
import { SkeletonGrid } from '../components/SkeletonGrid/SkeletonGrid';
import { ErrorState } from '../components/StateMessage/ErrorState';
import { EmptyState } from '../components/StateMessage/EmptyState';
import { Pagination } from '../components/Pagination/Pagination';
import controlStyles from '../components/Controls/Controls.module.css';
import styles from './Directory.module.css';

const LIMIT = 12;
const VALID_ROLES: Role[] = ['admin', 'moderator', 'user'];
const VALID_SORT_FIELDS: SortField[] = ['firstName', 'lastName', 'age'];

export function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const roleParam = searchParams.get('role');
  const role: Role | '' = VALID_ROLES.includes(roleParam as Role) ? (roleParam as Role) : '';
  const sortByParam = searchParams.get('sortBy');
  const sortBy: SortField | undefined = VALID_SORT_FIELDS.includes(sortByParam as SortField)
    ? (sortByParam as SortField)
    : undefined;
  const order: SortOrder = searchParams.get('order') === 'desc' ? 'desc' : 'asc';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const skip = (page - 1) * LIMIT;

  const query = useMemo(
    () => ({ q, role, sortBy, order, limit: LIMIT, skip }),
    [q, role, sortBy, order, skip],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useUsersQuery(query);

  const updateParams = useCallback(
    (patch: Record<string, string | null>, resetPage = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          if (resetPage) next.delete('page');
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>People directory</h1>
      <p className={styles.subheading}>Browse, search, and filter everyone in the DummyJSON directory.</p>

      <div className={controlStyles.bar}>
        <SearchBar value={q} onChange={(value) => updateParams({ q: value })} />
        <RoleFilterSelect
          value={role}
          disabled={q.trim().length > 0}
          onChange={(value) => updateParams({ role: value || null })}
        />
        <SortControl
          sortBy={sortBy}
          order={order}
          onSortByChange={(field) => updateParams({ sortBy: field ?? null, order: field ? order : null })}
          onOrderToggle={() => updateParams({ order: order === 'asc' ? 'desc' : 'asc' })}
        />
        {q.trim().length > 0 && (
          <p className={controlStyles.hint}>Role filter is unavailable while searching — clear the search to use it.</p>
        )}
      </div>

      {isError ? (
        <ErrorState message={error instanceof ApiError ? error.message : undefined} onRetry={refetch} />
      ) : isLoading ? (
        <SkeletonGrid count={LIMIT} />
      ) : !data || data.users.length === 0 ? (
        <EmptyState text="Try a different name, or clear your search and filters." />
      ) : (
        <>
          <p className={controlStyles.resultsLine}>
            <span>
              {data.total} {data.total === 1 ? 'person' : 'people'} · page {page} of {totalPages}
            </span>
          </p>
          <PersonGrid people={data.users} isFetching={isFetching} />
          <Pagination page={page} totalPages={totalPages} onPageChange={(next) => updateParams({ page: String(next) }, false)} />
        </>
      )}
    </div>
  );
}
