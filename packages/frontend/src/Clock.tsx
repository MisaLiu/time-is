import { useRef, useEffect } from 'preact/compat';
import type { FC } from 'preact/compat';

const Clock: FC<{
  timeOffset: number
}> = ({ timeOffset }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<number>(null);
  const lastSecondRef = useRef<number>(NaN);

  const updateTimeByTick = () => {
    if (!domRef.current) return;

    const date = new Date(Date.now() + timeOffset);
    if (date.getSeconds() !== lastSecondRef.current) {
      domRef.current.querySelector<HTMLSpanElement>('.hour')!.innerText = date.getHours().toString();
      domRef.current.querySelector<HTMLSpanElement>('.minute')!.innerText = date.getMinutes().toString();
      domRef.current.querySelector<HTMLSpanElement>('.second')!.innerText = date.getSeconds().toString();

      lastSecondRef.current = date.getSeconds();
    }

    clockRef.current = window.requestAnimationFrame(updateTimeByTick);
  };

  useEffect(() => {
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
