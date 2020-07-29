const app = require('express')();
const tile = require('./src/api/tile');

app
  .use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Content-Type', 'application/vnd.mapbox-vector-tile');
    next();
  })
  .use('/api/tile', tile)
  .listen(5000, () => console.log('Listen on 5000'));