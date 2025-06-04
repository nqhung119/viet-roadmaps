import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbarBrand}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 160 160"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logoSvg}
          aria-label="Viet Roadmaps Logo"
        >
          <circle cx="80" cy="80" r="75" fill="#0084FF" stroke="#ffffff" strokeWidth="2" />
          <circle cx="80" cy="30" r="8" fill="#ffffff" />
          <line x1="80" y1="38" x2="80" y2="65" stroke="#ffffff" strokeWidth="3" />
          <line x1="80" y1="65" x2="55" y2="90" stroke="#ffffff" strokeWidth="3" />
          <line x1="80" y1="65" x2="105" y2="90" stroke="#ffffff" strokeWidth="3" />
          <line x1="55" y1="90" x2="55" y2="115" stroke="#ffffff" strokeWidth="3" />
          <line x1="105" y1="90" x2="105" y2="115" stroke="#ffffff" strokeWidth="3" />
          <circle cx="55" cy="125" r="8" fill="#ffffff" />
          <circle cx="105" cy="125" r="8" fill="#ffffff" />
        </svg>
        <Link href="/" className={styles.brandName}>
          Viet Roadmaps
        </Link>
      </Link>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>
          Trang chủ
        </Link>
        <Link href="/roadmaps" className={styles.navLink}> {/* Điều chỉnh href nếu cần */}
          Sơ đồ
        </Link>
        <Link href="/about" className={styles.navLink}> {/* Điều chỉnh href nếu cần */}
          Giới thiệu
        </Link>
      </div>
      <div className={styles.authButtons}>
        <Link href="/login" className={`${styles.authButton} ${styles.loginButton}`}>
          Đăng nhập
        </Link>
        <Link href="/signup" className={`${styles.authButton} ${styles.signupButton}`}>
          Đăng ký
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;