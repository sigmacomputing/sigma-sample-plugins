import { useEffect } from 'react';

export function useHandleResize(
  chartRef: React.MutableRefObject<echarts.ECharts | undefined>
) {
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);
}
