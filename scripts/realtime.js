import { domain } from "./data.js";

export function setupRealtimeUpdates(newRecordCallback) {
    if (!domain.includes('vercel')) {
        const socket = io(domain);

        socket.on('sensorData', newRecord => {
            newRecordCallback(newRecord);
        });
    }
}
