import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPageItems(page: number, totalPages: number): PageItem[] {
  const items: PageItem[] = [];
  const siblings = 1;
  const first = 1;
  const last = totalPages;

  const start = Math.max(first + 1, page - siblings);
  const end = Math.min(last - 1, page + siblings);

  items.push(first);
  if (start > first + 1) items.push('ellipsis-start');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < last - 1) items.push('ellipsis-end');
  if (last > first) items.push(last);

  return items;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {items.map((item, index) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            className={clsx(styles.button, item === page && styles.active)}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        ) : (
          <span key={`${item}-${index}`} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ),
      )}

      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
