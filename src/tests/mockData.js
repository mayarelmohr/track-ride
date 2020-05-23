import { OrderedMap } from "immutable";

export const mockedDirections = {
  routes: [
    {
      copyrights: "Map data ©2020 ORION-ME",
      legs: [
        {
          distance: {
            text: "3.5 km",
            value: 1000,
          },
          steps: [
            {
              path: [
                {
                  lat: 29.9951,
                  lng: 31.445990000000002,
                },
                {
                  lat: 29.99584,
                  lng: 31.445980000000002,
                },
              ],
            },
          ],
        },
        {
          distance: {
            text: "3.5 km",
            value: 1000,
          },
          steps: [
            {
              path: [
                {
                  lat: 29.9951,
                  lng: 31.445990000000002,
                },
                {
                  lat: 29.99584,
                  lng: 31.445980000000002,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const mockedStations = () => {
  let mockedStations = new OrderedMap();
  const bookingsArray = [...Array(12)].map((i) => {
    return {
      name: "Dummy user",
      id: i,
      status: "in",
      payment: "cash",
    };
  });
  const secondBookingArray = [...Array(6)].map((i) => {
    return {
      name: "Dummy user",
      id: i * 10,
      status: "out",
      payment: "credit",
    };
  });
  mockedStations = mockedStations.set("213", {
    name: "Stop 1",
    bookings: bookingsArray,
  });
  mockedStations = mockedStations.set("214", {
    name: "Stop 2",
    bookings: secondBookingArray,
  });
  mockedStations = mockedStations.set("215", { name: "Stop 3", bookings: [] });
  mockedStations = mockedStations.set("216", {
    name: "Stop 4",
    bookings: bookingsArray,
  });
  return mockedStations;
};
