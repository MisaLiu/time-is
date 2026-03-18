import { useRef, useEffect } from 'preact/compat';
import type { FC } from 'preact/compat';

const fillZero = (number: number, length = 2) => (
  number.toString().padStart(length, '0')
);

const Clock: FC<{
  timeOffset: number
}> = ({ timeOffset }) => {
  const hourDomRef = useRef<HTMLSpanElement>(null);
  const minuteDomRef = useRef<HTMLSpanElement>(null);
  const secondDomRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<number>(null);
  const dateRef = useRef<Date>(null);
  const lastSecondRef = useRef<number>(NaN);

  const updateTimeByTick = () => {
    if (!hourDomRef.current || !minuteDomRef.current || !secondDomRef.current) return;

    if (!dateRef.current) dateRef.current = new Date();
    dateRef.current.setTime(Date.now() + timeOffset);

    const currentSecond = dateRef.current.getSeconds();
    if (currentSecond !== lastSecondRef.current) {
      secondDomRef.current.innerText = fillZero(currentSecond);

      const minuteStr = fillZero(dateRef.current.getMinutes());
      if (minuteDomRef.current.innerText != minuteStr)
        minuteDomRef.current.innerText = minuteStr;

      const hourStr = fillZero(dateRef.current.getHours());
      if (hourDomRef.current.innerText != hourStr)
        hourDomRef.current.innerText = hourStr;

      lastSecondRef.current = currentSecond;
    }

    clockRef.current = window.requestAnimationFrame(updateTimeByTick);
  };

  useEffect(() => {
    clockRef.current = window.requestAnimationFrame(updateTimeByTick);

    (() => {
      if (!clockRef.current) return;
      window.cancelAnimationFrame(clockRef.current);
      clockRef.current = null;
    });
  }, [timeOffset]);

  return (
    <div class="clock">
      <span class="hour" ref={hourDomRef}>00</span>
      <span class="hr" />
      <span class="minute" ref={minuteDomRef}>00</span>
      <span class="hr" />
      <span class="second" ref={secondDomRef}>00</span>
    </div>
  )
};

export default Clock;
