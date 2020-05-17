import React from "react";
import { BOOKING } from "../../helpers/constants";
import styles from "./styles.module.css";

const User = React.memo(({ booking }) => {
  const { name, picture, station, payment, status } = booking;
  const getBookingStatus = (status) => {
    switch (status) {
      case "in":
        return BOOKING.IN;
      case "out":
        return BOOKING.OUT;
      case "missed":
        return BOOKING.MISSED;
      default:
        return BOOKING.IN;
    }
  };
  return (
    <div className={styles.user}>
      <div className={styles.image}>
        <img src={picture} alt={name} />
      </div>
      <div>
        <p className={styles.name}>{name}</p>
        <p className={styles.info}>{`${station} ${getBookingStatus(
          status
        )}`}</p>
        <p className={styles.info}>
          <span role="img" aria-label="payment">
            {`💵 ${payment}`}
          </span>
        </p>
      </div>
    </div>
  );
});

export default User;
