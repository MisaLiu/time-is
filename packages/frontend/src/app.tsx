import Clock from './Clock';
import useTimeOffset from './useTime';
import './app.css';

export function App() {
  const {
    timeOffset,
  } = useTimeOffset();

  return (
    <>
      <div class={`clock-container ${isNaN(timeOffset) ? 'hide' : ''}`}>
        <Clock timeOffset={timeOffset} />
        <div class="offset">Time offset: {timeOffset}ms</div>
      </div>
      <div class={`placeholder ${isNaN(timeOffset) ? '' : 'hide'}`}>Connecting...</div>
    </>
  )
}
