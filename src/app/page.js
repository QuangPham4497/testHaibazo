import { FaGamepad } from "react-icons/fa";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/gamePage">
            <FaGamepad />
            Click to Start game now
          </Link>
        </div>
      </main>
    </div>
  );
}
