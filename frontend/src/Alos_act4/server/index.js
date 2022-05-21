const express = require('express');
const routerv1 = require('./v1/router');
const routerv2 = require('./v2/router');

const apiErrorHandler = require('./error/errorhandler');
const Morgan = require('morgan');


const app = express();
app.use(express.json());
app.use(Morgan('combined'));

//v1
app.use('/v1/', routerv1);
//v2
app.use('/v2/', routerv2);

app.use(apiErrorHandler);
var server = app.listen(8080, () => console.log(`serveur marche au port 8080`));
 module.exports = {
    server : server,
    app : app
};
