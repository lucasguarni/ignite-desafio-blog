import commonStyles from './../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={commonStyles.container}>
      <h1 aria-label="Blog SpaceTravelling" className={styles.logo}>
        <img src="/logo.svg" alt="Space Travelling logo" className={styles.logo} aria-hidden="true" />
      </h1>
    </header>
  )
}
