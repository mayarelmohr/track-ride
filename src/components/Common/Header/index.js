import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Header = React.memo(() => {
  return (
    <header className={styles.header}>
      <Link to="/">
        <h1 className={styles.wrapper}>
          <span className={styles.hidden}>Swvl</span>
          <img
            className={styles.logo}
            src="https://swvl.com/assets/img/swvl-new-logo.png"
            alt="swvl"
          />
        </h1>
      </Link>
    </header>
  );
});

export default Header;
