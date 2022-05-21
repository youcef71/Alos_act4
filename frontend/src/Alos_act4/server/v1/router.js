const express = require('express')
const router = express()
const Controller = require('./controllers/categories');
const Controller2 = require('./controllers/produits');


//GET
router.get('/categories', Controller.getcategorie);



//GET WITH ID
router.get('/categories/:id',Controller.idgetcategorie);
//POST
router.post('/categories',Controller.postcategorie);
//PUT
router.put('/categories/:id',Controller.putcategorie);
//DELETE
router.delete('/categories/:id',Controller.deletecategorie);



 //GET
 router.get('/produits', Controller2.getproduit);
 //GET WITH ID
 router.get('/produits/:id',Controller2.idgetproduit);
 //POST
 router.post('/produits',Controller2.postproduit);
 //PUT
 router.put('/produits/:id',Controller2.putproduit);
 //DELETE
 router.delete('/produits/:id',Controller2.deleteproduit);


module.exports = router;
