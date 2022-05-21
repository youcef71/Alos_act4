const Joi = require('joi');
const ApiError = require('../../error/ApiError');
const produits = require('../../db/produits.json');
const categories = require('../../db/categories.json');



// Function used for saving some empty values as null
 function setEmptyToNull(donnee) {
  
         if (Array.isArray(donnee)) {
             donnee.map(o => {
                if (typeof o === 'object') {
                    setEmptyToNull(o);
                }
            })
                        
         } else if(typeof donnee ==='string') {  
        if(donnee.trim() === '') {
            donnee = null;
           }  
         } else if(typeof donnee === 'object') {
             if (donnee === null) {
                 
             }
             else {
          setEmptyToNull(donnee);
             } 
        }
 
          return donnee;
   }
   
   

class Controller2 {
    
  //GET
  getproduit(req, res) {
      const compteur = produits.find(produit => produit.id_produit === produit.id_produit);
      //No produits
      if (!compteur) {
        return res.status(400).send(`Aucun produit disponible.`);
      }
      //Success
        res.status(200).json(produits)

    }
    
  //GET USING ID
  idgetproduit(req, res, next) {
        const id = parseInt(req.params.id)
        const produit = produits.find(produit => produit.id_produit === id)
        //No matching produit
        if (!produit) return    next(ApiError.badRequest(`Aucun produit correspondant n'est disponible.`));

      //Success
        res.status(200).json(produit)

    }

  //POST
  postproduit(req, res, next) {
    //Request should not be empty
     if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).send(`Requête vide.`);
    }
 

    //Verification if produit has the right schema
      const { error } = verifyproduit(req.body);
      if (error) {
      next(ApiError.badRequest(error.details[0].message));
      return;
      }


    
      //No matching categorie 
    const { categorie } = req.body;
    if ((categorie > produits.length || categorie === 0)) {
      next(ApiError.badRequest(`"categorie" n'existe pas.`));
      return;
    }
      //It is not a final sous categorie so no one consider it as a parent
      const souscategorie = categories.find(souscategorie => souscategorie.categorie_parente === categorie)
      //
      if (souscategorie) return    next(ApiError.badRequest(`"categorie" n'est pas une sous catégorie finale.`));

      
      
            //Produit does exist so this is not a new one
            const found = produits.find(
              (f) => f.nom_produit === req.body.nom_produit && f.categorie === req.body.categorie && f.marque === req.body.marque && f.couleur === req.body.couleur 
            );
            if (found) {
              next(ApiError.badRequest(`Déjà disponible.`));
              return;
              }
      
          
    

    //Modification before pushing the new produit
    let prod = {
      id_produit: produits.length + 1,
      categorie: req.body.categorie,
      nom_produit: req.body.nom_produit,
      marque: setEmptyToNull(req.body.marque),
      couleur: req.body.couleur,
      image: req.body.image,
      disponibilite: req.body.disponibilite,
      prix: req.body.prix,
      description: req.body.description,
      };
    
      
      
    //Success
    produits.push(prod)
    res.status(200).json(prod)
 
  }
  
  //PUT
  putproduit(req, res, next) {
        
    //Request should not be empty
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).send(`Requête vide.`);
    }
      
 
    
    
    //Verification if produit has the right schema
      const { error } = verifyproduit(req.body);
      if (error) {
      next(ApiError.badRequest(error.details[0].message));
      return;
      }

  //No matching categorie 
  const { categorie } = req.body;
  if ((categorie > produits.length || categorie === 0)) {
    next(ApiError.badRequest(`"categorie" n'existe pas.`));
    return;
  }
     //It is not a final sous categorie so no one consider it as a parent
     const souscategorie = categories.find(souscategorie => souscategorie.categorie_parente === categorie)
     //
     if (souscategorie) return    next(ApiError.badRequest(`"categorie" n'est pas une sous catégorie finale.`));

   
        //A produit that does not exist cannot be modified
        const id = parseInt(req.params.id)
        const produit = produits.find(produit => produit.id_produit === id)
        if (!produit) return    next(ApiError.badRequest(`Ce produit n'existe pas.`));


    //Successful modifiction
    produit.categorie= req.body.categorie,
    produit.nom_produit = req.body.nom_produit,
    produit.marque = setEmptyToNull(req.body.marque),
    produit.couleur= req.body.couleur,
    produit.image= req.body.image,
    produit.disponibilite= req.body.disponibilite,
    produit.prix= req.body.prix,
    produit.description= req.body.description,
    
    res.status(200).json(produit)

  }

  //DELETE
       deleteproduit(req, res, next) {
        const id = parseInt(req.params.id)
        const produit = produits.find(produit => produit.id_produit === id)
        // A produit that does not exist cannot be deleted
        if (!produit) return    next(ApiError.badRequest(`Ce produit n'existe pas.`));
        //Success : deleting produit
        produits.splice(produits.indexOf(produit),1) 
        //Update id
                  //Produits
                  produits.forEach(element => {
                    element.id_produit =element.id_produit - 1;
                  
                  });         
        res.status(200).json(produits)

    }

}
  


//Schema joi validator 
  function verifyproduit(produit) {
    const schema = Joi.object({
             categorie: Joi.number().integer().required().messages({
              'number.integer': `"categorie" doit etre du type 'entier'`,
              'number.empty': `"categorie" ne peut pas etre un champs vide`,
              'any.required': `"categorie" est un champ obligatoire`
            }),
             nom_produit: Joi.string().min(2).required().messages({
              'string.base': `"nom_produit" doit etre du type 'texte'`,
              'string.empty': `"nom_produit" ne peut pas etre un champs vide`,
              'string.min': `"nom_produit" doit avoir une longeur minimale de {#limit}`,
              'any.required': `"nom_produit" est un champ obligatoire`
            }),
             marque: Joi.string().allow(null).allow('').required().messages({
              'string.base': `"marque" doit etre du type 'texte'`,
              'string.min': `"marque" doit avoir une longeur minimale de {#limit}`,
              'any.required': `"marque" est un champ obligatoire`
            }),
             couleur: Joi.string().min(2).required().messages({
              'string.base': `"marque" doit etre du type 'texte'`,
              'string.empty': `"marque" ne peut pas etre un champs vide`,
              'string.min': `"marque" doit avoir une longeur minimale de {#limit}`,
              'any.required': `"marque" est un champ obligatoire`
            }),
             image: Joi.string().min(4).required().messages({
              'string.base': `"image" doit etre du type 'texte'`,
              'string.empty': `"image" ne peut pas etre un champs vide`,
              'string.min': `"image" doit avoir une longeur minimale de {#limit}`,
              'any.required': `"image" est un champ obligatoire`
            }),
             disponibilite: Joi.number().integer().required().messages({
              'number.integer': `"disponibilite" doit etre du type 'entier'`,
              'number.empty': `"disponibilite" ne peut pas etre un champs vide`,
              'any.required': `"disponibilite" est un champ obligatoire`
            }),
             prix: Joi.number().positive().required().messages({
              'number.base': `"prix" doit etre du type 'nombre'`,
              'number.positive': `"prix" doit etre un nombre positif`,
              'number.empty': `"prix" ne peut pas etre un champs vide`,
              'any.required': `"prix" est un champ obligatoire`
            }),
             description: Joi.string().required().messages({
              'string.base': `"description" doit etre du type 'texte'`,
              'string.empty': `"description" ne peut pas etre un champs vide`,
              'any.required': `"description" est un champ obligatoire`
            })
          
    });
  
    return schema.validate(produit);
  }
module.exports = new Controller2();
