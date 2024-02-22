// Import the necessary functions from data.js
import { loadAlertsData } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  const alertButton = document.getElementById("alert-nav");
  alertButton.addEventListener("click", async function () {
    this.classList.add("selected");
    document
      .querySelectorAll("#sensorMenu .sensor-item")
      .forEach((sensorItem) => {
        sensorItem.classList.remove("selected");
      });
    document.getElementById("alertSection").style.display = "block";
    document.getElementById("chartSection").style.display = "none";
    const alertsContainer = document.getElementById("alertsContainer");
    alertsContainer.innerHTML = "";
    // Fetch and display alerts data
    const alertsData = await loadAlertsData(); // Use the imported function

    // Create a container for the alerts
    const alertsList = document.createElement("div");

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
      alertsList.appendChild(alertDiv);
    });
    alertsContainer.appendChild(alertsList);

    // Optionally remove or adjust the "Hello Alerts" paragraph as needed
  });
});
