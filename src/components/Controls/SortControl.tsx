import clsx from 'clsx';
import type { SortField, SortOrder } from '../../api/users';
import { ChevronLeftIcon } from '../icons';
import styles from './Controls.module.css';

interface SortControlProps {
  sortBy: SortField | undefined;
  order: SortOrder;
  onSortByChange: (value: SortField | undefined) => void;
  onOrderToggle: () => void;
}

const SORT_LABELS: Record<SortField, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  age: 'Age',
};

export function SortControl({ sortBy, order, onSortByChange, onOrderToggle }: SortControlProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="sort-field" className={styles.fieldLabel}>
        Sort
      </label>
      <select
        id="sort-field"
        className={styles.select}
        value={sortBy ?? ''}
        onChange={(event) => onSortByChange((event.target.value || undefined) as SortField | undefined)}
      >
        <option value="">Default</option>
        {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
          <option key={field} value={field}>
            {SORT_LABELS[field]}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.orderToggle}
        onClick={onOrderToggle}
        disabled={!sortBy}
        aria-label={order === 'asc' ? 'Sort ascending, click for descending' : 'Sort descending, click for ascending'}
        title={order === 'asc' ? 'Ascending' : 'Descending'}
      >
        <ChevronLeftIcon className={clsx(styles.orderIcon, order === 'asc' ? styles.orderAsc : styles.orderDesc)} />
      </button>
    </div>
  );
}
