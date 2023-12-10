# Travel App

###  INSTALLING DEPENDENCIES:

    npm install

### Start the application in development mode:

    npm run build-dev

### Start the application in production mode:

    npm run build-prod

### Starting Node.js server:

    npm start

For development server you will need to start the dev-server and node in separate
console windows, as dev-server and node server will be activated on different ports at once.
Production mode can be run in the same one. First, the dist folder will be generated and then you can start the node.js server.

Production mode equipped with **service workers** that allow offline access if the server can not be reached, by creating a cached version of the website.


### TESTING
To run jest tests:

    npm run test

### STANDOUT FEATURES:

There is fresh **16 day weather forecast** available, when clicking on the weather button, displays forecast starting from the current date.

There is a button to **print** a page with all the travel information.

Remove trip button will **delete current trip**, that is located on the localStorage.

There is additional **clear input** button, to clear input fields if desired.


#### Lodging and Notes additional fields:

After creating the trip, a user can **add lodging info or/and notes**, that added to localStorage as well.
Lodging and notes can be added only to existing trip, so first a trip has to be created.

#### The Footer
Shows links to all APIs used in the app.
