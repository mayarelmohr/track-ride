import React from "react";
import { connect } from "react-redux";
import { getPaymentForTripSelector } from "../../selectors/statistics";
import { Pie } from "react-chartjs-2";
import styles from "./styles.module.css";

const TripPaymentMethodChart = ({ labels, points }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Booking Status",
        data: points,
        backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          display: false,
        },
      ],
    },
  };
  return (
    <section className={styles.section}>
      <h2>Payment methods for trip</h2>
      <Pie data={data} options={options} />
    </section>
  );
};

const mapStateToProps = (state) => {
  const paymentInfo = getPaymentForTripSelector(state);
  let labels = Object.keys(paymentInfo);
  let points = Object.values(paymentInfo);
  return { labels, points };
};

export default connect(mapStateToProps, {})(TripPaymentMethodChart);
