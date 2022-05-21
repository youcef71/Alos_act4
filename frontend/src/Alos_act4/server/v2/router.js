const express = require('express')
const routerv2 = express()
const ApiError = require('../error/ApiError');
const AuthController = require('./controllers/authcontroller');
const Controllerv2 = require('./controllers/categories');
const Controller2v2 = require('./controllers/produits');

 //FUNCTION TOKEN EXISTS
function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined')
    {const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
    }
    else{
return    next(ApiError.badRequest(`Authentifiez-vous pour effectuer cette requete.`));

    }
    
    }
// //GET
routerv2.get('/user', ensureToken,AuthController.getuser);

//POST LOGIN
routerv2.post('/login', ensureToken,AuthController.postlogin);
//GET LOGOUT
routerv2.get('/logout', ensureToken,AuthController.getlogout);
//REGISTER POST A USER
routerv2.post('/register', AuthController.postregister);




//GET
routerv2.get('/categories', ensureToken, Controllerv2.getcategorie);



//GET WITH ID
routerv2.get('/categories/:id', ensureToken,Controllerv2.idgetcategorie);
//POST
routerv2.post('/categories', ensureToken,Controllerv2.postcategorie);
routerv2.put('/categories/:id', ensureToken,Controllerv2.putcategorie);
//DELETE
routerv2.delete('/categories/:id', ensureToken,Controllerv2.deletecategorie);



 //GET
 routerv2.get('/produits',  ensureToken,Controller2v2.getproduit);
 //GET WITH ID
 routerv2.get('/produits/:id', ensureToken,Controller2v2.idgetproduit);
 //POST
 routerv2.post('/produits', ensureToken,Controller2v2.postproduit);
 //PUT
 routerv2.put('/produits/:id', ensureToken,Controller2v2.putproduit);
 //DELETE
 routerv2.delete('/produits/:id', ensureToken,Controller2v2.deleteproduit);


module.exports = routerv2;
