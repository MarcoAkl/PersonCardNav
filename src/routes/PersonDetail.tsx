import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useUserQuery } from '../hooks/useUserQuery';
import { useFavorites } from '../hooks/useFavorites';
import { FavoriteButton } from '../components/FavoriteButton/FavoriteButton';
import { ErrorState } from '../components/StateMessage/ErrorState';
import { ArrowLeftIcon } from '../components/icons';
import styles from './PersonDetail.module.css';

function formatAddress(address: { address: string; city: string; state: string; postalCode: string; country: string }) {
  return `${address.address}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
}

export function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { data: person, isLoading, isError, refetch } = useUserQuery(numericId);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div>
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon /> Back to directory
      </Link>

      {isError ? (
        <ErrorState message="We couldn't load this person's profile." onRetry={refetch} />
      ) : isLoading || !person ? (
        <div className={styles.card}>
          <div className={styles.skeletonHero}>
            <div className={clsx(styles.skeletonAvatar, styles.shimmer)} />
            <div className={styles.skeletonLines}>
              <div className={clsx(styles.skeletonLine, styles.shimmer)} style={{ width: '60%', height: 24 }} />
              <div className={clsx(styles.skeletonLine, styles.shimmer)} style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.hero}>
            <img src={person.image} alt="" className={styles.avatar} />
            <div className={styles.heroInfo}>
              <h1 className={styles.name}>
                {person.firstName} {person.lastName}
              </h1>
              <div className={styles.roleRow}>
                <span className={styles.jobTitle}>
                  {person.company.title} · Age {person.age}
                </span>
                <span className={styles.roleBadge}>{person.role}</span>
              </div>
            </div>
            <FavoriteButton
              className={styles.favorite}
              size="lg"
              isFavorite={isFavorite(person.id)}
              onToggle={() => toggleFavorite(person.id)}
              personName={`${person.firstName} ${person.lastName}`}
            />
          </div>

          <div className={styles.sections}>
            <section className={styles.section}>
              <h2>Contact</h2>
              <dl className={styles.rows}>
                <div className={styles.row}>
                  <dt>Email</dt>
                  <dd>{person.email}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Phone</dt>
                  <dd>{person.phone}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Username</dt>
                  <dd>{person.username}</dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
              <h2>Company</h2>
              <dl className={styles.rows}>
                <div className={styles.row}>
                  <dt>Company</dt>
                  <dd>{person.company.name}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Title</dt>
                  <dd>{person.company.title}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Department</dt>
                  <dd>{person.company.department}</dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
              <h2>Address</h2>
              <dl className={styles.rows}>
                <div className={styles.row}>
                  <dt>Home</dt>
                  <dd>{formatAddress(person.address)}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Company</dt>
                  <dd>{formatAddress(person.company.address)}</dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
              <h2>About</h2>
              <dl className={styles.rows}>
                <div className={styles.row}>
                  <dt>Gender</dt>
                  <dd className={styles.capitalize}>{person.gender}</dd>
                </div>
                <div className={styles.row}>
                  <dt>Birth date</dt>
                  <dd>{person.birthDate}</dd>
                </div>
                <div className={styles.row}>
                  <dt>University</dt>
                  <dd>{person.university}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
