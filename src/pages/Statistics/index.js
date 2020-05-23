import React from "react";
import { withRouter, Link } from "react-router-dom";
import BookingStatusChart from "./BookingStatusChart";
import PaymentMethodChart from "./PaymentMethodChart";
import NumberOfBookingBarChart from "./NumberOfBookingBarChart";
import TripPaymentMethodChart from "./TripPaymentMethodChart";
import styles from "./styles.module.css";

const Statistics = React.memo(() => {
  return (
    <section className={styles.container}>
      <TripPaymentMethodChart />
      <NumberOfBookingBarChart />
      <PaymentMethodChart />
      <BookingStatusChart />
      <p>
        <Link className={styles.button} to="/">
          Back to Ride
        </Link>
      </p>
    </section>
  );
});

export default withRouter(Statistics);
