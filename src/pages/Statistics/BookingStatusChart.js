import React from "react";
import { connect } from "react-redux";
import { getBookingStatus } from "../../selectors/statistics";
import { Doughnut } from "react-chartjs-2";
import styles from "./styles.module.css";

const BookingStatusChart = ({ labels, points }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Booking Status",
        data: points,
        backgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
      <h2>Status of Bookings across all stops</h2>
      <Doughnut data={data} options={options} />
    </section>
  );
};

const mapStateToProps = (state) => {
  const { stations } = state.trip;
  const bookingStatus = getBookingStatus(stations);
  let labels = Object.keys(bookingStatus);
  let points = Object.values(bookingStatus);
  return { labels, points };
};

export default connect(mapStateToProps, {})(BookingStatusChart);
