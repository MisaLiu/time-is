import { useRef, useEffect } from 'preact/compat';
import type { FC } from 'preact/compat';

const fillZero = (number: number, length = 2) => {
  let result = `${number}`;
  while (result.length < length) result = `0${result}`;
  return result;
}

const Clock: FC<{
  timeOffset: number
}> = ({ timeOffset }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<number>(null);
  const lastSecondRef = useRef<number>(NaN);

  const updateTimeByTick = () => {
    if (isNaN(timeOffset)) return;
    if (!domRef.current) return;

    const date = new Date(Date.now() + timeOffset);
    if (date.getSeconds() !== lastSecondRef.current) {
      domRef.current.querySelector<HTMLSpanElement>('.hour')!.innerText = fillZero(date.getHours());
      domRef.current.querySelector<HTMLSpanElement>('.minute')!.innerText = fillZero(date.getMinutes());
      domRef.current.querySelector<HTMLSpanElement>('.second')!.innerText = fillZero(date.getSeconds());

      lastSecondRef.current = date.getSeconds();
    }

    clockRef.current = window.requestAnimationFrame(updateTimeByTick);
  };

  useEffect(() => {
    if (isNaN(timeOffset)) return;

    clockRef.current = window.requestAnimationFrame(updateTimeByTick);

    (() => {
      if (!clockRef.current) return;
      window.cancelAnimationFrame(clockRef.current);
    });
  }, [timeOffset]);

  return (
    <div class="clock" ref={domRef}>
      <span class="hour">00</span>
      <span class="hr" />
      <span class="minute">00</span>
      <span class="hr" />
      <span class="second">00</span>
    </div>
  )
};

export default Clock;
