import React from "react";

const Loading = React.memo(() => (
  <p>
    <span role="img" aria-labelledby="loading">
      ⏳
    </span>
    Loading
  </p>
));

export default Loading;
