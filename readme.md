# Charge receipt exporter

Exports receipts from an API into a mongodb database by polling the API periodically to check for new data

## Getting started

Run the following commands to setup the repository

```
cp .env.example .env
nvm use
npm install
```

Put the URI for your MongoDB database into the `.env` file, and also update the api url.

```
npm start
```

## Mock API

If you want to run the mock-api then you can start it by running `node ./mock-api/index.js`
