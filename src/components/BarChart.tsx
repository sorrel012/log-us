import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

export default function BarChart({ chartData, chartOptions }) {
    const chartRef = useRef(null);
    let chartInstance = null;

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const createChart = () => {
            Chart.register(...registerables);
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions,
            });
        };

        const destroyChart = () => {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        };

        destroyChart();
        createChart();

        return () => {
            destroyChart();
        };
    }, [chartData, chartOptions]);

    return (
        <canvas
            ref={chartRef}
            style={{
                width: '1000px',
                maxWidth: '2000px',
                height: '400px',
                maxHeight: '500px',
            }}
        />
    );
}
