import styles from "./OurMission.module.css";

interface OurMissionProps {
  title: string;
  description: string;
}

export const OurMission = ({ title, description }: OurMissionProps) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
