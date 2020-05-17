import { BOOKING } from "./constants";

const generateUserData = (userId) => {
  const picture = `https://robohash.org/${userId}.png?size=50x50`;
  const status = BOOKING.IN;
  return { picture, status };
};
export default generateUserData;
