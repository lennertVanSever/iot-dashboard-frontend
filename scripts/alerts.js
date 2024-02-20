// Import the necessary functions from data.js
import { loadAlertsData } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  const alertButton = document.getElementById("alert-nav");
  alertButton.addEventListener("click", async function () {
    const sensorTitle = document.getElementById("sensorTitle");
    sensorTitle.textContent = "Alerts";

    const chartTypeSwitch = document.getElementById("chartTypeSwitch");
    const chartsContainer = document.getElementById("chartsContainer");
    const headerElement = document.querySelector("header");
    chartTypeSwitch.style.display = "none";
    chartsContainer.style.display = "none";

    // Remove the previous alerts container if it exists
    const existingAlertsContainer = document.getElementById("alertsContainer");
    if (existingAlertsContainer) {
      existingAlertsContainer.remove();
    }

    // Fetch and display alerts data
    const alertsData = await loadAlertsData(); // Use the imported function

    // Create a container for the alerts
    const alertsContainer = document.createElement("div");
    alertsContainer.id = "alertsContainer";
    headerElement.insertAdjacentElement("afterend", alertsContainer); // Adjust based on your layout

    // Populate the container with alert data
    alertsData.forEach((alert) => {
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert-entry";
      const date = new Date(alert.data.timestamp);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      alertDiv.innerHTML = `<a href="index.html?sensor=${alert.data.sensorId}">${alert.data.sensorId}</a> has a problem: ${alert.data.problemId} at ${formattedDate}`;
      alertsContainer.appendChild(alertDiv);
    });

    // Optionally remove or adjust the "Hello Alerts" paragraph as needed
  });
});
