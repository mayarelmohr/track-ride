import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getStationsPath } from "../../selectors/stations";
import withModal from "../Common/ModalHOC";
import styles from "./styles.module.css";

const AddPassengerToStationForm = (props) => {
  const [values, setValues] = useState({
    name: "",
    payment: "cash",
  });
  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    setValues({ ...values, [name]: value });
  };
  console.log(values);
  return (
    <form className={styles["form-wrapper"]}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Book Ride</legend>
        <label className={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            className={styles.input}
            onChange={handleChange}
            value={values.name}
          />
        </label>
        <label htmlFor="station" className={styles.label}>
          Station:
          <select
            name="station"
            id="station-select"
            className={styles.input}
            onChange={handleChange}
            value={values.station}
          >
            <option value="">Station</option>
            <option value="dog">123</option>
          </select>
        </label>
        <label>
          <span className={styles.label}>Select you payment:</span>
          <input
            type="radio"
            id="credit"
            name="payment"
            value="credit"
            checked={values.payment === "credit"}
            onChange={handleChange}
          />
          <label htmlFor="credit" className={styles["radio-label"]}>
            Credit
          </label>
          <input
            type="radio"
            id="cash"
            name="payment"
            value="cash"
            checked={values.payment === "cash"}
            onChange={handleChange}
          />
          <label htmlFor="cash" className={styles["radio-label"]}>
            Cash
          </label>
        </label>
      </fieldset>
    </form>
  );
};

const mapStateToProps = (state) => {
  const { stations } = state.trip;
  return {
    stations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withModal(AddPassengerToStationForm));
