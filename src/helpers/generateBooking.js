import { BOOKING } from "./constants";

export const generateUserData = (userId) => {
  const picture = `https://robohash.org/${userId}.png?size=50x50`;
  const status = BOOKING.IN;
  return { picture, status };
};

export const generateBookingStatus = (bookings) => {
  const randomBookings = [BOOKING.IN, BOOKING.MISSED, BOOKING.OUT];
  const newBookings = bookings.map((user) => {
    const newBookingStatusIndex = Math.floor(Math.random() * 2) + 1;
    user.status = randomBookings[newBookingStatusIndex - 1];
    return user;
  });
  return newBookings;
};
