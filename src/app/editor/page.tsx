import styles from "./page.module.css";
import SceneEditor from "@/components/SceneEditor";

export default function Editor() {
  return (
    <main className={styles.main}>
      <SceneEditor />
    </main>
  );
}
