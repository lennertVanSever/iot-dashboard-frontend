export async function loadSensorData() {
    try {
        const response = await fetch('http://localhost:3000/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading sensor data:', error);
    }
}

export function groupDataBySensor(data) {
    const grouped = {};
    data.forEach(entry => {
        const identifier = `${entry.data.location}-${entry.data.device_name}`;
        if (!grouped[identifier]) {
            grouped[identifier] = {
                timestamps: [],
                temperatures: [],
                pressures: [],
                voltages: []
            };
        }
        grouped[identifier].timestamps.push(entry.timestamp);
        grouped[identifier].temperatures.push(parseFloat(entry.data.temperature));
        grouped[identifier].pressures.push(parseFloat(entry.data.pressure));
        grouped[identifier].voltages.push(entry.data.battery_voltage);
    });
    return grouped;
}

export function updateGroupedDataWithNewRecord(groupedData, newRecord) {
    // Assuming newRecord.data contains { location, device_name, temperature, pressure, battery_voltage }
    const identifier = `${newRecord.data.location}-${newRecord.data.device_name}`;
    if (!groupedData[identifier]) {
        groupedData[identifier] = { temperatures: [], pressures: [], voltages: [], timestamps: [] };
    }

    // Update groupedData with the new record
    groupedData[identifier].temperatures.push(parseFloat(newRecord.data.temperature));
    groupedData[identifier].pressures.push(parseFloat(newRecord.data.pressure));
    groupedData[identifier].voltages.push(newRecord.data.battery_voltage);
    groupedData[identifier].timestamps.push(newRecord.timestamp);

    return identifier; // Return the sensorId for further processing
}
