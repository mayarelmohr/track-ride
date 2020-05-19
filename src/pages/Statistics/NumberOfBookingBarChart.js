import React from "react";
import { connect } from "react-redux";
import {
  getStationNames,
  getBookingsCountPerStation,
} from "../../selectors/statistics";
import { Bar } from "react-chartjs-2";
import styles from "./styles.module.css";

const NumberOfBookingBarChart = ({ stationNames, bookingsCountPerStation }) => {
  const data = {
    labels: stationNames,
    datasets: [
      {
        label: "Number of Bookings",
        data: bookingsCountPerStation,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <section className={styles.section}>
      <h2>Number of Bookings for each stop</h2>
      <Bar data={data} options={options} />
    </section>
  );
};

const mapStateToProps = (state) => {
  const { stations } = state.trip;
  const bookingsCountPerStation = getBookingsCountPerStation(stations);
  const stationNames = getStationNames(stations);
  debugger;
  return { stationNames, bookingsCountPerStation };
};

export default connect(mapStateToProps, {})(NumberOfBookingBarChart);
