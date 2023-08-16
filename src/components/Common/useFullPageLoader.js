import { useState } from "react";

const useFullPageLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? 'Loading' : null,
    () => setLoading(true), //Show loader
    () => setLoading(false) //Hide Loader
  ];
};

export default useFullPageLoader;