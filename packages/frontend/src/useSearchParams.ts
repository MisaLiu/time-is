import { useState, useEffect } from 'preact/hooks';

const useSearchParams = () => {
  const [ searchParams, setSearchParams ] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSearchParams(searchParams);
  }, []);

  return {
    searchParams
  };
};

export default useSearchParams;
