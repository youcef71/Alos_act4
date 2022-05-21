const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../error/ApiError');
const users = require('../../db/users');



//POST LOGIN

class AuthController {
    //REGISTER
    postregister(req, res, next) {
//password
         var hashedPassword = bcrypt.hashSync(req.body.password, 8);

//Modification before pushing the new user
var new_userID = users.length + 1
var  usr = {
    id_user: new_userID,
   email: req.body.email,
    password: hashedPassword,
 };



     users.push(usr)
     var token = jwt.sign(  {
        authId: new_userID
    }    , 'secret_code');
     res.status(200).send({
        authentificated: true,
        token: token
    })
    }
    //LOGIN

    postlogin(req, res, next) {

const email = (req.body.email)
const user = users.find(user => user.email === email)
//No matching user
if (!user) return    next(ApiError.badRequest(`Aucun utilisateur correspondant.`));

var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
if (!passwordIsValid) return    next(ApiError.badRequest(`Le mot de passe est incorrecte.`));
//
var token = jwt.sign(  {
    authId: user.id_user
}    , 'secret_code');

res.send({
    authentificated: true,
    token: token
});
    }
    //GET
    getuser(req, res) {
        jwt.verify(req.token, 'secret_code', function(err, data) {
            if(err)
            {    return    next(ApiError.badRequest(`Échec de l'authentification.`));
        }
            
        else{
    
            // const id = parseInt(req.params.id)
            const user = users.find(user => user.id_user === data.authId)

            delete user['password']
    
          //Success
            res.status(200).json(user)
        }
          
    });
    }
    
 //LOG OUT   
    getlogout(req, res) {
        res.status(200).send({
            authentificated: false,
            token: null
        });
            }


}
module.exports = new AuthController();
