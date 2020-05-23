import React from "react";
import styles from "./styles.module.css";

const Loading = React.memo(() => (
  <div className={styles.loading}>
    <span role="img" aria-labelledby="loading">
      ⏳
    </span>
    Loading
  </div>
));

export default Loading;
