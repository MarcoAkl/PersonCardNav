import { Link } from 'react-router-dom';
import clsx from 'clsx';
import type { UserSummary } from '../../api/types';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './PersonCard.module.css';

const ROLE_DOT: Record<UserSummary['role'], string> = {
  admin: styles.roleAdmin,
  moderator: styles.roleModerator,
  user: styles.roleUser,
};

const ROLE_BADGE: Record<UserSummary['role'], string> = {
  admin: styles.roleBadgeAdmin,
  moderator: styles.roleBadgeModerator,
  user: styles.roleBadgeUser,
};

interface PersonCardProps {
  person: UserSummary;
}

export function PersonCard({ person }: PersonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fullName = `${person.firstName} ${person.lastName}`;
  const favorite = isFavorite(person.id);

  return (
    <article className={styles.card}>
      <FavoriteButton
        className={styles.favorite}
        isFavorite={favorite}
        onToggle={() => toggleFavorite(person.id)}
        personName={fullName}
      />
      <Link to={`/person/${person.id}`} className={styles.link}>
        <div className={styles.avatarRow}>
          <div className={styles.avatarWrap}>
            <img src={person.image} alt="" className={styles.avatar} loading="lazy" width={76} height={76} />
            <span className={clsx(styles.roleDot, ROLE_DOT[person.role])} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.body}>
          <p className={styles.name}>{fullName}</p>
          <p className={styles.title}>{person.company.title}</p>
          <p className={styles.company}>{person.company.name}</p>
          <span className={clsx(styles.roleBadge, ROLE_BADGE[person.role])}>{person.role}</span>
        </div>
      </Link>
    </article>
  );
}
