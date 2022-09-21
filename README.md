# Leetcode Roulette API
The main API used for [Leetcode Roulette](https://leetcoderoulette.com).

![ci](https://github.com/conventional-changelog/standard-version/workflows/ci/badge.svg)
[![NPM version](https://img.shields.io/npm/v/standard-version.svg)](https://www.npmjs.com/package/standard-version)

> API hosted at https://api.leetcoderoulette.com

## Getting Started
To get started running the Leetcode Roulette APIs locally, clone the repository to your local machine and change to the project root directory. Next, make sure to make the needed configurations and run `npm install` to get the needed packages for the project. Next, build and run the project with `npm run build` followed by `npm start` respectively.

```
git clone https://github.com/leetcode-roulette/api-proxy.git
cd api-proxy
npm install
npm run build
npm start
```

This will install the required dependencies on your local machine followed by building the source code to a `dist` folder and running the server code in the `dist/index.js` file.


### Prerequisites
Before running the Leetcode Roulette APIs locally, the following steps will need to be taken to ensure the needed software will be installed or set up.

* Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [NodeJS](https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try4) and setup using the provided [instructions](https://www.mongodb.com/docs/atlas/getting-started/)
* Follow the instructions in the [leetcode-roulette/problem-extractor](https://github.com/leetcode-roulette/problem-extractor) service to populate the database with the needed resources.

### Initial Configuration
Before starting, you'll need to configure the mongoose database connection string. This can be done by creating a `.env` file in the root directory of the project. In the `.env` file, be sure to specify a connection string named `MONGO_CONNECTION_STRING`.

#### Examples:
* ***MONGO_CONNECTION_STRING***: "mongodb://localhost:27017/myDB"

## Developing
To begin development on this project, clone the repository to your local machine and change to the project root directory. Next, make sure to make the needed configurations and run `npm install` to get the needed packages for the project. Finally, run the `npm run dev` command to deploy a local development environment on your local machine.

```
git clone https://github.com/leetcode-roulette/api-proxy.git
cd api-proxy
npm install
npm run dev
```

This will spin up a nodemon server using the server code in the `src/index.ts` file.

### Building
To build the project, run the `npm run build` command.

```
npm run build
```

This will compile the typescript in the `src` folder and create a new `dist` folder consisting of built Javascript code.

### Testing
To test the project, run the `npm run test` command.

```
npm run test
```

This will run the tests in any file in the `src` directory following the specified formats.

* `"**/tests/**/*.spec.ts"`
* `"**/tests/**/*.test.ts"`

## Features
This project allows users to retrieve problems and tags from [leetcode](https://leetcode.com). 

## Configuration
The following configurations can be specified in a `.env` file.

##### MONGO_CONNECTION_STRING
Type: `String`
Default: None

Specifies mongodb database uri for mongoose to connect to.

```Javascript
mongoose.connect(MONGO_CONNECTION_STRING); // Connects to the provided uri
```

##### PORT
Type: `Integer`
Default: 3000

Specifies which port the server will run on.

```javascript
app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`); // Log the port the application is being run on
});
```

##### VERSION
Type: `String`
Default: `'1.0.0'`

Specifies the current version of the project.

##### ENVIRONMENT
Type: `String`
Default: `'dev'`

Specifies the environment that is being used.

```javascript
res.status(200).json({
  version: VERSION,
  environment: ENVIRONMENT,
  status: "Live"
});
```

## Built With
* [NodeJS](https://nodejs.org) - Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.
* [MongoDB](https://mongodb.com) - MongoDB is a source-available cross-platform document-oriented database program.
* [Express.JS](https://expressjs.com) - Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under the MIT License.
* [Typescript](https://typescriptlang.org) - TypeScript is a free and open source programming language developed and maintained by Microsoft.
