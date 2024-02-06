export function populateSensorMenu(sensors, selectedSensor, callback) {
    const menu = document.getElementById('sensorMenu');
    menu.innerHTML = '';
    sensors.forEach(sensorId => {
        const item = document.createElement('div');
        item.innerText = sensorId.replace(/-/g, ' ').replace(/_/g, ' ');
        item.className = 'sensor-item';
        item.setAttribute('data-sensor-id', sensorId); // Set data attribute for identification
        if (sensorId === selectedSensor) {
            item.classList.add('selected');
        }
        item.addEventListener('click', () => callback(sensorId));
        menu.appendChild(item);
    });
}


export function highlightSelectedSensor(selectedSensor) {
    const items = document.querySelectorAll('.sensor-item');
    items.forEach(item => {
        if (item.innerText.replace(/ /g, '_') === selectedSensor.replace(/-/g, '_')) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}
