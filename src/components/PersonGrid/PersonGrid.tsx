import clsx from 'clsx';
import type { UserSummary } from '../../api/types';
import { PersonCard } from '../PersonCard/PersonCard';
import styles from './PersonGrid.module.css';

interface PersonGridProps {
  people: UserSummary[];
  isFetching?: boolean;
}

export function PersonGrid({ people, isFetching }: PersonGridProps) {
  return (
    <div className={clsx(styles.grid, isFetching && styles.fetching)}>
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}
