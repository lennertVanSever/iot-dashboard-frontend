// realtime.js
export function setupRealtimeUpdates(newRecordCallback) {
    const socket = io('http://localhost:3000');

    socket.on('sensorData', newRecord => {
        newRecordCallback(newRecord);
    });
}
