import React from "react";
import styles from "./loader.module.scss";

const NemoLoader = () => {
  return (
    <div className={styles.loading}>
      <img src="/new/loader.png" width={107} height={107}/>
    </div>
  );
};

export default NemoLoader;
