import React from "react";
import styles from "./styles.module.css";

const TripInformation = React.memo(({ distance, time }) => {
  return (
    <section>
      <h2>Trip Information</h2>
      <p>{`Trip Duration: ${time} ms`}</p>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.image}>
            <img src="https://robohash.org/1234?size=50x50" alt="Robert" />
          </div>
          <div className={styles.car}>
            <img src="./images/van.svg" alt="car mode" />
          </div>
          <div>
            <p className={styles.highlighted}>
              Herbert Patton
              <span className={styles.rate}>
                <span role="img" aria-label="rating">
                  ⭐️
                </span>
                5.0
              </span>
            </p>
            <p>Toyato HiAce - GA 2770</p>
          </div>
        </div>
        <div className={styles.destination}>
          <span> New Cairo</span>
          <span> Nasr City</span>
        </div>
        <dl className={styles.about}>
          <div>
            <dt>
              <span role="img" aria-label="location">
                📍
              </span>
              Trip Distance:
            </dt>
            <dd>{`${distance} KM`}</dd>
          </div>
          <div>
            <dt>
              <span role="img" aria-label="fare">
                💵
              </span>
              Trip Fare:
            </dt>
            <dd>45 EGP</dd>
          </div>
        </dl>
      </div>
    </section>
  );
});

export default TripInformation;
