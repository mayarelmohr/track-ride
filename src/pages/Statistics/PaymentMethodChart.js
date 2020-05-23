import React from "react";
import { connect } from "react-redux";
import {
  getPaymentInfoPerStationSelector,
  getStationNamesSelector,
} from "../../selectors/statistics";
import { Bar } from "react-chartjs-2";
import styles from "./styles.module.css";

const chartOptions = {
  responsive: true,
  legend: {
    position: "top",
  },
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
const PaymentMethodChart = ({ stationNames, paymentMethodsForStations }) => {
  return (
    <section className={styles.section}>
      <h2>Number of different Payment Methods for each station</h2>
      <Bar
        data={{
          labels: stationNames,
          datasets: [
            {
              label: "Cash",
              data: paymentMethodsForStations.cash,
              backgroundColor: "rgba(75, 192, 192, 1)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Credit",
              data: paymentMethodsForStations.credit,
              backgroundColor: "rgba(255, 159, 64, 1)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={chartOptions}
      />
    </section>
  );
};

const mapStateToProps = (state) => {
  const paymentMethodsForStations = getPaymentInfoPerStationSelector(state);
  const stationNames = getStationNamesSelector(state);
  return { stationNames, paymentMethodsForStations };
};

export default connect(mapStateToProps, {})(PaymentMethodChart);
