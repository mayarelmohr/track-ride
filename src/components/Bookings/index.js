import React from "react";
import User from "./user";
import styles from "./styles.module.css";

const Bookings = ({ bookingsList }) => {
  return (
    <section>
      <h2>Bookings</h2>
      <ul className={styles.list}>
        {bookingsList.map((booking) => (
          <li>
            <User booking={booking} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Bookings;
