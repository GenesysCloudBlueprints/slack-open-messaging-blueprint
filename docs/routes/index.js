const routes = require('express').Router()
    , genesys = require('./genesys')
    , slack = require('./slack');


routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/slack/openmessaging/genesys', genesys);
routes.use('/slack/openmessaging/slack', slack);

module.exports = routes;