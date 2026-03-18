import Clock from './Clock';
import useTimeOffset from './useTime';
import './app.css';

export function App() {
  const {
    timeOffset,
    isFetching,
    accuracy
  } = useTimeOffset();

  return (
    <>
      <div class={`clock-container ${isFetching ? 'hide' : ''}`}>
        <Clock timeOffset={timeOffset} />
        <div class="offset">
          Time offset: {Math.round(timeOffset * 1000) / 1000}ms
          (±{Math.round(accuracy * 1000) / 1000}ms)
        </div>
      </div>
      <div class={`placeholder ${isFetching ? '' : 'hide'}`}>Connecting...</div>
    </>
  )
}
