import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function MyComponent() {
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://your-api-url")
      .then((response) => {
        // Handle successful response data
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError("Unauthorized access");
        } else {
          setError("An error occurred while fetching data");
        }
      });
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {/* Other content of your component */}
    </div>
  );
}

export default MyComponent;
