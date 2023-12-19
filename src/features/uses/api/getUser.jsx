import { useEffect, useState } from "react";

export const getUser = (props) => {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = props;

    const fetchUserData = async () => {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        setUser(json);
      } catch (e) {
        setError(e);
      }
    };

    fetchUserData();
  }, [props]);

  return { user, error };
};
