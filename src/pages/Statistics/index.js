import React from "react";
import { withRouter, Link } from "react-router-dom";
import BookingStatusChart from "./BookingStatusChart";
import PaymentMethodChart from "./PaymentMethodChart";
import NumberOfBookingBarChart from "./NumberOfBookingBarChart";
import styles from "./styles.module.css";

const Statistics = React.memo(() => {
  return (
    <section className={styles.container}>
      <BookingStatusChart />
      <NumberOfBookingBarChart />
      <PaymentMethodChart />
      <p>
        <Link className={styles.button} to="/">
          Back to Ride
        </Link>
      </p>
    </section>
  );
});

export default withRouter(Statistics);
