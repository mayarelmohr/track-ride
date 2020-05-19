import React, { useState } from "react";
import { connect } from "react-redux";
import { OrderedMap } from "immutable";
import { getAvailableStations } from "../../selectors/stations";
import { generateBooking } from "../../reducers/trip";

import Button from "../Common/Button";
import withModal from "../Common/ModalHOC";
import styles from "./styles.module.css";

const AddPassengerToStationForm = (props) => {
  const { availableStations, hasStations } = props;
  const [values, setValues] = useState({
    name: "",
    station: "",
    payment: "cash",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    if (value && errors[name]) {
      setErrors([name], "");
    }
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let submitErrors = {};
    for (const attribute in values) {
      if (!values[attribute]) {
        submitErrors[attribute] = `Please add ${attribute}`;
      }
    }
    if (Object.keys(submitErrors).length > 0) {
      setErrors(submitErrors);
      return;
    }
    props.generateBookingAction(values);
    props.onDismissAction();
  };

  return (
    <form className={styles["form-wrapper"]} onSubmit={handleSubmit}>
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
        {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
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
            {availableStations.map((station) => {
              return (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              );
            })}
          </select>
        </label>
        {errors.station ? (
          <p className={styles.error}>{errors.station}</p>
        ) : null}
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
      <p className={styles.button}>
        {hasStations ? null : (
          <p className={styles.error}>Sorry, All stations are full</p>
        )}
        <Button disabled={!hasStations} type="submit" text="Add passenger" />
      </p>
    </form>
  );
};

const mapStateToProps = (state) => {
  let { stations } = state.trip;
  if (!OrderedMap.isOrderedMap(stations)) {
    stations = new OrderedMap(stations);
  }
  const availableStations = getAvailableStations(stations);
  const hasStations = availableStations.size > 1;
  return {
    availableStations,
    hasStations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    generateBookingAction: (data) => dispatch(generateBooking(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withModal(AddPassengerToStationForm));
