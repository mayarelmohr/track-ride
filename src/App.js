import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Trip from "./pages/Trip";
import Statistics from "./pages/Statistics";
import Header from "./components/Common/Header";
export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/trip/:topicId">
            <Trip />
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
          <Route path="/">
            <Trip />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
