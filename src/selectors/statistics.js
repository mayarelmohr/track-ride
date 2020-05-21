import { BOOKING, PAYMENT_METHOD } from "../helpers/constants";

export const getBookingStatus = (stations) => {
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
};

export const getPaymentInfoPerStation = (stations) => {
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
};

export const getStationNames = (stations) => {
  return stations.reduce((acc, station) => {
    acc.push(station.name);
    return acc;
  }, []);
};

export const getBookingsCountPerStation = (stations) => {
  return stations.reduce((acc, station) => {
    acc.push(station.bookings.length);
    return acc;
  }, []);
};
