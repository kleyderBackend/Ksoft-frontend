import styles from "./OurVission.module.css";

interface OurVisionProps {
  title: string;
  description: string;
}

export const OurVision = ({ title, description }: OurVisionProps) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};