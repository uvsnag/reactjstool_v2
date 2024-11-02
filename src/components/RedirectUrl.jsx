import React, { useEffect } from "react";

const RedirectUrl = ({ url }) => {
    useEffect(() => {
      window.location.href = url;
    }, [url]);
  
    return <h5>Redirecting...</h5>;
  };
  export default RedirectUrl;