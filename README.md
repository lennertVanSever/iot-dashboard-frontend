# Frontend IoT Dashboard - Lennert Van Sever

live url: https://iot-dashboard-inky.vercel.app

Before starting the frontend, make sure that the [backend](https://github.com/lennertVanSever/iot-dashboard-server) is already running locally on http://localhost:3000

To start this frontend just serve the index.html with a tool like [http-server](https://www.npmjs.com/package/http-server) or a vscode extension like [LiveSever](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Tech stack

As a personal challenge I wanted to use as little libraries as possible. It's written in pure HTML, CSS and JavaScript.

However 2 tasks were too complicated to write completely from scratch. The graph visualization is handled by [plotly.js](https://plotly.com/javascript/). Another library I used is socket.io for making the app real time.

## Progressive Web App (PWA)

This app is also a PWA. It means that it can be installed from the browser as a native app on any platform (even desktop). It's easier to try it with the live url: https://iot-dashboard-inky.vercel.app

## Deployment

To deploy the frontend, I used Vercel. Since I have no build step, it was very easy to deploy.
