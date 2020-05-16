import React from "react";
import styles from "./styles.module.css";

const Button = (props) => {
  const { action, text, type, disabled } = props;
  return (
    <button
      className={styles.button}
      name={text}
      disabled={disabled}
      type={type}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default Button;
