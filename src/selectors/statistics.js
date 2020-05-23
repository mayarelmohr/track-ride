import { createSelector } from "reselect";
import { BOOKING, PAYMENT_METHOD } from "../helpers/constants";
import { stationsSelector } from "./selectors";

export const getBookingStatusSelector = createSelector(
  stationsSelector,
  (stations) => {
    /** groups all users in stops as per bookingStatus */
    const { IN, OUT, MISSED } = BOOKING;
    const bookingData = { [IN]: 0, [OUT]: 0, [MISSED]: 0 };
    stations.map((station) => {
      const { bookings } = station;
      return bookings.forEach((booking) => {
        const { status } = booking;
        bookingData[status]++;
      });
    });
    return bookingData;
  }
);

export const getPaymentInfoPerStationSelector = createSelector(
  stationsSelector,
  (stations) => {
    /**Accumulates payment data for all users */
    const data = {
      [PAYMENT_METHOD.CREDIT]: [],
      [PAYMENT_METHOD.CASH]: [],
    };
    stations.forEach((station) => {
      let cashPerStation = 0;
      let creditPerStation = 0;
      station.bookings.forEach((booking) => {
        if (booking.payment === PAYMENT_METHOD.CREDIT) {
          creditPerStation++;
        } else {
          cashPerStation++;
        }
      });
      data[PAYMENT_METHOD.CREDIT].push(creditPerStation);
      data[PAYMENT_METHOD.CASH].push(cashPerStation);
    });
    return data;
  }
);

export const getStationNamesSelector = createSelector(
  stationsSelector,
  (stations) => {
    /**list all station names in an array*/
    return stations.reduce((acc, station) => {
      acc.push(station.name);
      return acc;
    }, []);
  }
);

export const getBookingsCountPerStationSelector = createSelector(
  stationsSelector,
  (stations) => {
    /**get number of bookings for each station*/
    return stations.reduce((acc, station) => {
      acc.push(station.bookings.length);
      return acc;
    }, []);
  }
);

export const getPaymentForTripSelector = createSelector(
  stationsSelector,
  (stations) => {
    const data = {
      [PAYMENT_METHOD.CREDIT]: 0,
      [PAYMENT_METHOD.CASH]: 0,
    };
    stations.forEach((station) => {
      station.bookings.forEach((booking) => {
        if (booking.payment === PAYMENT_METHOD.CREDIT) {
          data[PAYMENT_METHOD.CREDIT]++;
        } else {
          data[PAYMENT_METHOD.CASH]++;
        }
      });
    });
    return data;
  }
);
