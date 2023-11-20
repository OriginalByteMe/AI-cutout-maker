import { useState, useEffect } from 'react';
import axios from 'axios';

const useWarmup = () => {
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_CUTOUT_API + '/warmup');
        if (response.status === 200) {
          setIsSuccessful(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return isSuccessful;
};

export default useWarmup;
