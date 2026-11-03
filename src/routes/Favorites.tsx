import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { getUserById } from '../offline/usersRepository';
import { PersonGrid } from '../components/PersonGrid/PersonGrid';
import { SkeletonGrid } from '../components/SkeletonGrid/SkeletonGrid';
import { ErrorState } from '../components/StateMessage/ErrorState';
import { EmptyState } from '../components/StateMessage/EmptyState';
import controlStyles from '../components/Controls/Controls.module.css';
import styles from './Directory.module.css';

export function Favorites() {
  const { favorites } = useFavorites();
  const ids = useMemo(() => [...favorites].sort((a, b) => a - b), [favorites]);

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['user', id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getUserById(id, signal),
      staleTime: 60_000,
    })),
  });

  const isLoading = results.length > 0 && results.some((result) => result.isLoading);
  const people = results.filter((result) => result.isSuccess).map((result) => result.data!);
  const allFailed = ids.length > 0 && !isLoading && people.length === 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Favorites</h1>
      <p className={styles.subheading}>People you've saved, stored locally in this browser.</p>

      {ids.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          text="Star someone from the directory to save them here."
          action={
            <Link to="/" className={controlStyles.select} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Browse the directory
            </Link>
          }
        />
      ) : isLoading ? (
        <SkeletonGrid count={ids.length} />
      ) : allFailed ? (
        <ErrorState
          message="We couldn't load your favorites."
          onRetry={() => results.forEach((result) => result.refetch())}
        />
      ) : (
        <>
          <p className={controlStyles.resultsLine}>
            <span>
              {people.length} saved {people.length === 1 ? 'person' : 'people'}
            </span>
          </p>
          <PersonGrid people={people} />
        </>
      )}
    </div>
  );
}
