const express = require('express');
const bodyParser = require('body-parser');
const router = require('./application/routes/index');
const path = require('path');
const log4js = require('../private_modules/default/logerHandler/log4js');
const PORT = 3000 || process.env.PORT;

const logger = log4js.log();
const loggerConsole = logger.getLogger();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/md.html');
// });

app.use(bodyParser.json());
app.use('/', router);

app.get('/', (req, res) => {
  res.render('index');
});

const server = app.listen(PORT, function () {
  loggerConsole.info(`Server running on: http://localhost:${PORT}`);
  const socket = require('../src/infrastructure/sockets/chat');
  socket(server);
});
