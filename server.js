const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const actionRouter = require('./data/helpers/actionRouter.js');
const projectRouter = require('./data/helpers/projectRouter.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('short'));
server.use(cors());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send('<h2>API is running</h2>');
});

module.exports = server;
