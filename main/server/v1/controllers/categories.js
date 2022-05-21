const Joi = require('joi');
const ApiError = require('../../error/ApiError');
const categories = require('../../db/categories.json')
const produits = require('../../db/produits.json')


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
// Function used for deleting a categorie
function deleteCat(categorie,id) {
          var compter = 0;
          //Success : deleting categorie
          categories.splice(categories.indexOf(categorie),1)
          
          //Deleting its Produits
          var produit = produits.find(produit => produit.categorie === id)
          while(produit){
          produits.splice(produits.indexOf(produit),1)
                  //Update id
                  //Produits
                  produits.forEach(element => {
                    element.id_produit =element.id_produit - 1;
                  
                  });   
          var produit = produits.find(produit => produit.categorie === id)
  
        }
          compter = compter +1;
          // Same for sous categories :
          var scategorie = categories.find(scategorie => scategorie.categorie_parente === id)
          while(scategorie){
            deleteCat(scategorie,scategorie.id_categorie);
          var scategorie = categories.find(scategorie => scategorie.categorie_parente === id)
  
        }        
          
          // Update the id of :
          
          //Sous categories and the categories
          categories.forEach(element => {
            if(element.id_categorie > id) element.id_categorie =element.id_categorie - compter;
            if(element.categorie_parente > id) element.categorie_parente =element.categorie_parente - compter;
  
          });
          //Produits
          produits.forEach(element => {
            if(element.categorie > id) element.categorie =element.categorie - compter;
          
          });  
 }

  
   

class Controller {
    
  //GET
  getcategorie(req, res) {

  
 
      const compteur = categories.find(categorie => categorie.id_categorie === categorie.id_categorie);
      //No categories
      if (!compteur) {
        return res.status(400).send(`Aucune catégorie disponible.`);
      }
      //Success
        res.status(200).json(categories)

    }
    
  //GET USING ID
  idgetcategorie(req, res, next) {
        const id = parseInt(req.params.id)
        const categorie = categories.find(categorie => categorie.id_categorie === id)
        //No matching categorie
        if (!categorie) return    next(ApiError.badRequest(`Aucune catégorie correspondante n'est disponible.`));

      //Success
        res.status(200).json(categorie)

    }

  //POST
  postcategorie(req, res, next) {
    //Request should not be empty
     if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).send(`Requête vide.`);
    }
 
    
    
    //Verification if categorie has the right schema
      const { error } = verifyCategorie(req.body);
      if (error) {
      next(ApiError.badRequest(error.details[0].message));
      return;
      }

      
      //No matching categorie parente 
    const { categorie_parente } = req.body;
    if ((categorie_parente > categories.length || categorie_parente === 0)) {
      next(ApiError.badRequest(`"categorie_parente" n'existe pas.`));
      return;
    }
    
      //It must not be a final sous categorie it has to be a parent 
      const souscategorie = categories.find(souscategorie => souscategorie.categorie_parente === categorie_parente)
      if (!souscategorie) return    next(ApiError.badRequest(`"categorie_parente" n'est pas une catégorie mère.`));

    

      //Categorie does exist so this is not a new one
      const found = categories.find(
        (f) => f.nom_categorie === req.body.nom_categorie 
      );
      if (found) {
        next(ApiError.badRequest(`Déjà disponible.`));
        return;
        }
    
        
    //Modification before pushing the new categorie
    let categ = {
        id_categorie: categories.length + 1,
        nom_categorie: req.body.nom_categorie,
        categorie_parente: setEmptyToNull(req.body.categorie_parente),
      };
    
      
      
    //Success
    categories.push(categ)
    res.status(200).json(categ)
 
  }
  
  //PUT
  putcategorie(req, res, next) {
    //Request should not be empty

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).send(`Requête vide.`);
    }
      
 
    
    
    //Verification if categorie has the right schema
      const { error } = verifyCategorie(req.body);
      if (error) {
      next(ApiError.badRequest(error.details[0].message));
      return;
      }

    const { categorie_parente } = req.body;
    //No matching categorie parente
    if ((categorie_parente > categories.length || categorie_parente === 0)) {
      next(ApiError.badRequest(`"categorie_parente" n'existe pas.`));
      return;
    }
          //It must not be a final sous categorie it has to be a parent 
          const souscategorie = categories.find(souscategorie => souscategorie.categorie_parente === categorie_parente)
          if (!souscategorie) return    next(ApiError.badRequest(`"categorie" n'est pas une catégorie mère.`));
    
       //A categorie that does not exist cannot be modified
       const id = parseInt(req.params.id)
       const categorie = categories.find(categorie => categorie.id_categorie === id)
       if (!categorie) return    next(ApiError.badRequest(`Cette catégorie n'existe pas.`));
    
    //Successful modifiction
    categorie.nom_categorie = req.body.nom_categorie,
    categorie.categorie_parente = setEmptyToNull(req.body.categorie_parente),
    
    res.status(200).json(categorie)

  }

  //DELETE
       deletecategorie(req, res, next) {
          const id = parseInt(req.params.id)
        const categorie = categories.find(categorie => categorie.id_categorie === id)
        // A categoire that does not exist cannot be deleted
        if (!categorie) return    next(ApiError.badRequest(`Cette catégorie n'existe pas.`));
        deleteCat(categorie, id);        
        res.status(200).json(categories)

    }

}
  


//Schema joi validator 
  function verifyCategorie(categorie) {
    const schema = Joi.object({
      nom_categorie: Joi.string().min(2).required().messages({
        'string.base': `"nom_categorie" doit etre du type 'texte'`,
        'string.empty': `"nom_categorie" ne peut pas etre un champs vide`,
        'string.min': `"nom_categorie" doit avoir une longeur minimale de {#limit}`,
        'any.required': `"nom_categorie" est un champ obligatoire`
      }),
      categorie_parente: Joi.number().integer().allow(null).allow('').required().messages({
        'number.integer': `"categorie_parente" doit etre du type 'entier'`,
        'any.required': `"categorie_parente" est un champ obligatoire`
      }),
    });
  
    return schema.validate(categorie);
  }
module.exports = new Controller();
