import { useState, useEffect } from 'preact/hooks';
import sa from 'superagent';

const useTimeOffset = (ntpServer?: string | null) => {
  const [ timeOffset, setTimeOffset ] = useState<number>(NaN);
  const [ accuracy, setAccuracy ] = useState<number>(NaN);
  const [ fetchError, setFetchError ] = useState(null);

  useEffect(() => {
    const t0 = Date.now();
    
    sa.get('/api/time')
      .query({
        ntpServer,
      })
      .accept('json')
      .then((e) => {
        const t3 = Date.now();
        const { body } = e;

        const t1 = body.data.serverReceiveTime;
        const t2 = body.data.serverSendTime;
        const ntpTime = body.data.ntpTime;

        const offset = ((t1 - t0) + (t2 - t3)) / 2;

        const correctedTime = t3 + offset;
        const _accuracy = Math.abs(correctedTime - ntpTime);

        setTimeOffset(offset);
        setAccuracy(_accuracy);
      })
      .catch((e) => {
        console.error(e);
        setFetchError(e);
      });
  }, []);

  return {
    timeOffset,
    accuracy,
    fetchError,
  };
};

export default useTimeOffset;
