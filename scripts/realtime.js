import { domain } from "./data.js";

export function setupRealtimeUpdates(newRecordCallback) {
    const socket = io(domain);

    socket.on('sensorData', newRecord => {
        newRecordCallback(newRecord);
    });
}
