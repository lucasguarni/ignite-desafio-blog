import commonStyles from './../../styles/common.module.scss';
import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={commonStyles.container}>
      <h1 aria-label="Blog SpaceTravelling" className={styles.logo}>
        <Link href="/">
          <img src="/logo.svg" alt="logo" className={styles.logo} aria-hidden="true" />
        </Link>
      </h1>
    </header>
  )
}
