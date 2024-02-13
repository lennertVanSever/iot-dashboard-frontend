
export function createChart(metricName, sensorData, container, sensorId) {
    let chartId = `${sensorId}-${metricName.replace(/\s+/g, '-')}`.toLowerCase();
    chartId = chartId.replace(/-\(.+\)/g, '')
    let chartDiv = document.getElementById(chartId);

    if (!chartDiv) {
        chartDiv = document.createElement('div');
        chartDiv.id = chartId; // Assign the generated ID
        chartDiv.className = 'chart';
        container.appendChild(chartDiv);
    }

    // Get the CSS variables values from the root (or any other element)
    const rootStyle = getComputedStyle(document.documentElement);
    const bgColor = rootStyle.getPropertyValue('--chart-bg-color').trim();
    const textColor = rootStyle.getPropertyValue('--text-color').trim();
    const borderColor = rootStyle.getPropertyValue('--border-color').trim();

    // Declare dataKey at the beginning of the function
    let dataKey;
    let color;

    switch (metricName) {
        case 'Temperature':
            dataKey = 'temperatures';
            color = rootStyle.getPropertyValue('--accent-color-temperature').trim();
            break;
        case 'Pressure':
            dataKey = 'pressures';
            color = rootStyle.getPropertyValue('--accent-color-pressure').trim();
            break;
        case 'Battery Voltage':
            dataKey = 'voltages';
            color = rootStyle.getPropertyValue('--accent-color-voltage').trim();
            break;
        default:
            console.error('Unknown metric:', metricName);
            return; // Exit if metric name is not recognized
    }

    const chartType = window.currentChartType; // Use the global variable

    // Adjust the data definition to use the chartType variable
    const data = [{
        x: sensorData.timestamps,
        y: sensorData[dataKey],
        type: chartType, // Use the variable instead of hardcoding 'scatter'
        mode: chartType === 'line' ? 'lines+markers' : undefined,
        marker: { color: color },
        line: chartType === 'line' ? { color: color, width: 2 } : undefined
    }];

    const paddingFactor = 0.001; // This is a 10% padding
    const minYValue = Math.min(...sensorData[dataKey]) * (1 - paddingFactor);
    const maxYValue = Math.max(...sensorData[dataKey]) * (1 + paddingFactor);

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
            color: textColor,
            family: 'var(--font-family)'
        },
        title: {
            text: metricName,
            font: { size: 16, color: textColor }
        },
        xaxis: {
            title: 'Timestamp',
            tickfont: { color: textColor },
            gridcolor: borderColor
        },
        yaxis: {
            title: metricName,
            autorange: false,
            range: [minYValue, maxYValue],
            tickfont: { color: textColor },
            gridcolor: borderColor
        },
        margin: { l: 60, r: 20, t: 30, b: 70 }
    };

    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

    const config = { responsive: true, staticPlot: isMobile, }

    Plotly.newPlot(chartDiv, data, layout, config);
}

export function updateChart(metricName, newPoint, sensorId) {
    console.log({ metricName, newPoint, sensorId })
    const chartId = `${sensorId}-${metricName.replace(/\s+/g, '-')}`.toLowerCase().replace(/-\(.+\)/g, '');
    const chartDiv = document.getElementById(chartId);

    console.log({ metricName, newPoint, sensorId })

    if (!chartDiv) {
        console.error(`Chart container not found for ${chartId}`);
        return;
    }

    // Retrieve the current data from the chart instance
    const chartData = chartDiv.data;

    // If there's no data or the structure is not as expected, return
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
        console.error(`No data found for chart ${chartId}`);
        return;
    }

    // Check the chart type and update accordingly
    if (chartData[0].type === 'line') {
        // For line charts, extend the traces
        Plotly.extendTraces(chartDiv, { x: [[newPoint.timestamp]], y: [[newPoint.value]] }, [0]);
    } else if (chartData[0].type === 'bar') {
        // For bar charts, update the data object
        chartData[0].x.push(newPoint.timestamp);
        chartData[0].y.push(newPoint.value);
        // Redraw the chart with updated data
        Plotly.react(chartId, chartData, chartDiv.layout);
    }

    console.log("Chart updated");
}

setTimeout(() => {
    updateChart(
        "Battery Voltage",
        {
            "timestamp": "2024-02-09T13:17:39.196Z",
            "value": 471
        },
        "AILABO_HEATER2-BME2"
    )
}, 5000)
