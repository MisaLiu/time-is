import { useState, useEffect } from 'preact/hooks';

const REQUEST_COUNT = 4;

const buildApiEndpoint = (ntpServer?: string | null) => {
  let result = '/api/time';
  if (ntpServer) result += `?server=${ntpServer}`;
  return result;
};

const calculateMedian = (values: number[]) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculateMean = (values: number[]) => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateStandardDeviation = (values: number[], mean: number) => {
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

const useTimeOffset = () => {
  const [ timeOffset, setTimeOffset ] = useState<number>(0);
  const [ accuracy, setAccuracy ] = useState<number>(0);
  const [ fetchError, setFetchError ] = useState(null);
  const [ isFetching, setIsFetching ] = useState(false);

  const fetchMultipleTimes = async (ntpServer?: string | null) => {
    const offsets: number[] = [];
    const accuracies: number[] = [];
    const timestamps: number[] = [];
    
    setIsFetching(true);
    setFetchError(null);

    try {
      for (let i = 0; i < REQUEST_COUNT; i++) {
        const t0 = Date.now();

        const body = await fetch(buildApiEndpoint(ntpServer), {
          cache: 'no-cache',
        }).then(e => e.json());
        if (body.msg !== 'ok') throw new Error(body.msg);

        const t3 = Date.now();

        const t1 = body.data.serverReceiveTime;
        const t2 = body.data.serverSendTime;
        const ntpTime = body.data.ntpTime;

        const offset = ((t1 - t0) + (t2 - t3)) / 2;
        const correctedTime = t3 + offset;
        const accuracy = Math.abs(correctedTime - ntpTime);

        offsets.push(offset);
        accuracies.push(accuracy);
        timestamps.push(t3);
      }

      const meanOffset = calculateMean(offsets);
      const medianOffset = calculateMedian(offsets);
      const meanAccuracy = calculateMean(accuracies);
      
      const offsetStdDev = calculateStandardDeviation(offsets, meanOffset);
      const finalOffset = medianOffset;
      const finalAccuracy = Math.sqrt(meanAccuracy * meanAccuracy + offsetStdDev * offsetStdDev);

      setTimeOffset(finalOffset);
      setAccuracy(finalAccuracy);

    } catch (error) {
      console.error(error);
      setFetchError(error as any);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    fetchMultipleTimes(searchParams.get('server'));
  }, []);

  return {
    timeOffset,
    accuracy,
    fetchError,
    isFetching,
  };
};

export default useTimeOffset;
