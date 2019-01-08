# Street AR

Street AR is an interactive mobile app that utilizes computer vision AI to help art lovers discover and learn more about artists and their artwork by simply taking a picture of the artwork with the Street AR mobile app.

## Installation

### Prerequisites

What you will need installed to get this app running locally:

1. [Node.js](https://nodejs.org/)
2. [Expo CLI](https://expo.io/tools)
3. [Expo Mobile App](https://expo.io/tools)
4. [Clarifai Developer Account](https://www.clarifai.com/developer)

### Getting Started

Steps to get the app up and running:

1. Fork and clone this repository.
2. Install dependencies, run command: `npm install`
3. Create a `.env` file in the root of the project, and add your [Clarifai](https://www.clarifai.com/developer) api, secret, and access keys. See the `.env.example` for an example of code structure.
4. To start the app, run command: `npm start` or `expo start`
5. Launching the app on your mobile device:
   - **iOS:** Open your camera app and hover over the barcode from the terminal or browser. You will get an alert from expo, which you can click on, and it will then open up the Expo app and begin unbundling the code.
   - **Android:** Open the Expo app, then take a picture of the barcode. This will then begin to unbundle the code.
6. Once the code has finished unbundling, the app should be running!

\***\*NOTE:** If you have your directory cloned into an area of your machine that automatically backs up your data to iCloud or similar service, your mobile device will be stuck in a bundling loop. To fix this, either move the project directory into a folder that does not get automatically backed up, or turn off this feature while using the app.
