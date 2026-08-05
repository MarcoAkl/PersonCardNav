import type { Role } from '../../api/types';
import styles from './Controls.module.css';

const ROLES: Role[] = ['admin', 'moderator', 'user'];

interface RoleFilterSelectProps {
  value: Role | '';
  onChange: (value: Role | '') => void;
  disabled?: boolean;
}

export function RoleFilterSelect({ value, onChange, disabled }: RoleFilterSelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="role-filter" className={styles.fieldLabel}>
        Role
      </label>
      <select
        id="role-filter"
        className={styles.select}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as Role | '')}
      >
        <option value="">All roles</option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role[0].toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
