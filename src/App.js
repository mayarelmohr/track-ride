import React, { useEffect } from "react";
import Map from "./Map";
import route from "./route.csv";
import { csv } from "d3";

import "./App.css";

const App = () => {
  useEffect(() => {
    async function readCSV() {
      const data = await csv(route);
    }
    readCSV();
  }, []);
  return (
    <div className="App">
      <Map />
    </div>
  );
};

export default App;
