import styles from "./HeaderSection.module.css";

interface HeaderSectionProps {
  title: string;
  subTitle: string;
}

export const HeaderSection = ({ title, subTitle }: HeaderSectionProps) => {
  return (
    <section className={styles.stnCoantinerHeader}>
      <div className={styles.dvConatinerHeaderSections}>
        <h1>{title}</h1>
        <p>
          <span>{subTitle}</span>
        </p>
      </div>
    </section>
  );
};
