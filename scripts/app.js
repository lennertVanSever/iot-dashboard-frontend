import { loadSensorData, groupDataBySensor, updateGroupedDataWithNewRecord } from './data.js';
import { populateSensorMenu, highlightSelectedSensor } from './ui.js';
import { createChart, updateChart } from './chart.js';
import { setupRealtimeUpdates } from './realtime.js';

window.currentChartType = 'line';

const getSelectedSensorId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sensor');
}
document.addEventListener('DOMContentLoaded', async () => {

    const selectedSensorId = getSelectedSensorId();

    const sensorData = await loadSensorData();
    const groupedData = groupDataBySensor(sensorData);
    const sensorIds = Object.keys(groupedData);

    function updateURLWithSensor(sensorId) {
        const url = new URL(window.location);
        url.searchParams.set('sensor', sensorId);
        window.history.pushState({}, '', url);
    }

    function displayChartsForSensor(sensorId) {
        console.log(sensorId);
        const sensorData = groupedData[sensorId];
        const chartsContainer = document.getElementById('chartsContainer');
        chartsContainer.innerHTML = '';
        const mainTitle = document.getElementById('sensorTitle');
        mainTitle.textContent = sensorId.replace(/_/g, ' ').replace(/-/g, ' ');
        ['Temperature (°C)', 'Pressure (hPa)', 'Battery Voltage (mV)'].forEach(metric => {
            createChart(metric, sensorData, chartsContainer, sensorId);
        });
    }

    populateSensorMenu(sensorIds, selectedSensorId, (sensorId) => {
        updateURLWithSensor(sensorId);
        displayChartsForSensor(sensorId);
        highlightSelectedSensor(sensorId);
    });

    if (selectedSensorId && groupedData[selectedSensorId]) {
        displayChartsForSensor(selectedSensorId);
    } else if (sensorIds.length > 0) {
        const firstSensorId = sensorIds[0];
        updateURLWithSensor(firstSensorId);
        displayChartsForSensor(firstSensorId);
        highlightSelectedSensor(firstSensorId);
    }

    setupRealtimeUpdates(newRecord => {
        console.log(newRecord);
        // Assuming newRecord has { timestamp, data: { location, device_name, temperature, pressure, battery_voltage } }

        const sensorId = `${newRecord.data.location}-${newRecord.data.device_name}`;
        const selectedSensorId = getSelectedSensorId();

        if (sensorId === selectedSensorId) {
            // Map each metric in newRecord.data to its respective updateChart call
            if (newRecord.data.temperature !== undefined) {
                updateChart('Temperature (°C)', { timestamp: newRecord.timestamp, value: newRecord.data.temperature }, sensorId);
            }
            if (newRecord.data.pressure !== undefined) {
                updateChart('Pressure (hPa)', { timestamp: newRecord.timestamp, value: newRecord.data.pressure }, sensorId);
            }
            if (newRecord.data.battery_voltage !== undefined) {
                updateChart('Battery Voltage (mV)', { timestamp: newRecord.timestamp, value: newRecord.data.battery_voltage }, sensorId);
            }
        }

        const menuItem = document.querySelector(`.sensor-item[data-sensor-id="${sensorId}"]`);

        if (menuItem) {
            // Add the class to trigger the animation
            menuItem.classList.add('flash-highlight');

            // Optionally, remove the class after the animation completes (1s duration as defined)
            setTimeout(() => menuItem.classList.remove('flash-highlight'), 1000);
        }
    });

    document.getElementById('chartTypeSelector').addEventListener('change', function () {
        window.currentChartType = this.value;
        const selectedSensorId = getSelectedSensorId();
        displayChartsForSensor(selectedSensorId)
    });
});

