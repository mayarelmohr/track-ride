This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## App Overview

This app is created to demo a live ride

https://track-live-ride.netlify.app/

1. Create React App: used for faster setup for a react app.
2. Redux: for storing state.
3. Redux Persist: to cache state through Local Forage.
4. React Google maps.
5. CSS modules: supported by default in create react app and are helpful when naming classes since classes are hashed after building and they are useful for css splitting to reduce render blocking time.
6. React Chart js: used for graphs.

The major functionalities in the app are

1. Read stations from route.csv file
2. Read list of users from dummy csv created with the same station ids through https://mockaroo.com/
3. Receive directions from google maps by using their Directions api service
4. Through directions received, Routes can be drawn on map by using Directions Renderer
5. Book ride button: adds a new passenger for a certain stop and generates a picture from https://robohash.org/ through random generated user id.
6. Stations that have already 12 passengers are not available when booking a ride
7. The Trip's time is set through a constant time +- 30sec which is randomized
8. Start ride: I update the marker location on the app by looping on the paths returned from Directions API, also there is a constant time for stopping between stations and randomizing the booking status for passengers on each station
9. On reload: the indices for the last paths are cached and then the motion is resumed again
10. There are three states for each ride: FINISHED, IDLE and TRACKING. while TRACKING, both the options start and book ride are disabled
    - IDLE: user is able to add passenger to available stations and start a ride
    - TRACKING: car moves, and stations get updated
    - FINISHED: user is directed to statistics page
11. Reset ride button: It doesn't change the bookings list nor stations list. It just change the ride state to IDLE, to be able to either book places or start ride again

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
