import Clock from './Clock';
import useSearchParams from './useSearchParams';
import useTimeOffset from './useTime';
import './app.css';

export function App() {
  const { searchParams } = useSearchParams();
  const {
    timeOffset,
    accuracy
  } = useTimeOffset(searchParams?.get('server'));

  return (
    <>
      <div class={`clock-container ${isNaN(timeOffset) ? 'hide' : ''}`}>
        <Clock timeOffset={timeOffset} />
        <div class="offset">
          Time offset: {Math.round(timeOffset * 1000) / 1000}ms
          (±{accuracy}ms)
        </div>
      </div>
      <div class={`placeholder ${isNaN(timeOffset) ? '' : 'hide'}`}>Connecting...</div>
    </>
  )
}
