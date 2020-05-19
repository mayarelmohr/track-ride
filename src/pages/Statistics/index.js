import React from "react";
import { withRouter, Link } from "react-router-dom";
import Button from "../../components/Common/Button";

const Statistics = (props) => {
  return (
    <Link text="Back to Ride" to="/">
      {" "}
      Back to ride
    </Link>
  );
};

export default withRouter(Statistics);
