import { useState, useEffect } from 'preact/hooks';
import sa from 'superagent';

const useTimeOffset = () => {
  const [ timeOffset, setTimeOffset ] = useState<number>(NaN);
  const [ fetchCost, setFetchCost ] = useState<number>(NaN);
  const [ fetchError, setFetchError ] = useState(null);

  useEffect(() => {
    const fetchStartTime = Date.now();

    sa.get('/api/time')
      .query({
        reqTime: fetchStartTime,
      })
      .accept('json')
      .then((e) => {
        const { body } = e;

        const ntpOffset = body.data.ntpTime - body.data.ntpResponseTime;
        setTimeOffset(ntpOffset);
        setFetchCost(Math.abs(Date.now() - fetchStartTime));
      })
      .catch((e) => {
        console.error(e);
        setFetchError(e);
      });
  }, []);

  return {
    timeOffset,
    fetchCost,
    fetchError,
  };
};

export default useTimeOffset;
