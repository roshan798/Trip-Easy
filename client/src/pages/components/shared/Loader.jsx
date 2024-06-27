import styles from "./loader.module.css";
export default function Loader() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full p-4">
      <svg
        className={styles.loader}
        viewBox="0 0 384 384"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={styles.active}
          pathLength="360"
          fill="transparent"
          strokeWidth="32"
          cx="192"
          cy="192"
          r="176"
        ></circle>
        <circle
          className={styles.track}
          pathLength="360"
          fill="transparent"
          strokeWidth="32"
          cx="192"
          cy="192"
          r="176"
        ></circle>
      </svg>
    </div>
  );
}
