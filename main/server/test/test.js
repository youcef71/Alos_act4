const app = require("../index").app;

const server = require("../index").server;
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
server.close();
//CATEGORIES
describe('categories APIs', () => {
//GET categories
// Success
    describe("GET categories /categories", () => {
        it("It should GET all the categories", (done) => {
            chai.request(app)
                .get("/categories")
                .end((err, response) => {
                    response.should.have.status(200);
                    // list objets
                     response.body.should.be.a('array');
                    // list non vide
                     response.body.length.should.not.be.eq(0);
                done();
                });
        });
// //No categories = Empty array
//         it("It should not GET an empty array", (done) => {
//             chai.request(app)
//                 .get("/categories")
//                 .end((err, response) => {
//                     response.should.have.status(400);
                    
//                 done();
//                 });
//         });

    });

    // GET USING ID
    describe("GET /categories/:id", () => {
        it("It should GET the matching categorie", (done) => {
            const categorieId = 61;
            chai.request(app)
                .get("/categories/" + categorieId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id_categorie').eq(61);
                    response.body.should.have.property('nom_categorie');
                    response.body.should.have.property('categorie_parente');
                    
                done();
                });
        });
// No matching categorie
        it("It should not GET a categorie with this id", (done) => {
            const categorieId = 900;
            chai.request(app)
                .get("/categories/" + categorieId)
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

    });


    // POST 
     describe("POST /categories", () => {
         // Success
        it("It should POST a new categorie", (done) => {
            const categ = {
                nom_categorie: "Test01",
                categorie_parente: null
            };
            chai.request(app)
                .post("/categories")
                .send(categ)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id_categorie');
                    response.body.should.have.property('nom_categorie').eq("Test01");
                    response.body.should.have.property('categorie_parente').eq(null);
                done();
                });
        });
                
        // Empty request
        it("It should not POST with an empty request", (done) => {
            const categ = {

            };
            chai.request(app)
                .post("/categories")
                .send(categ)
                .end((err, response) => {
                    response.should.have.status(400);
                    
                done();
                });
        });
        // categorie that does not match the schema
        it("It should not POST a categorie that does not match the schema", (done) => {
            const categ = {
                nom_categorie: "",
                categorie_parente: null
            };
            chai.request(app)
                .post("/categories")
                .send(categ)
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

       // Categorie exists
        it("It should not POST a categorie that exists", (done) => {
            const categ = {
                nom_categorie: "Ecrans PC",
                categorie_parente: null
            };
            chai.request(app)
                .post("/categories")
                .send(categ)
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });
      //No matching categorie parente 
        it("It should not POST a categorie with categorie_parent that does not exist", (done) => {
        const categ = {
            nom_categorie: "nom du categorie",
            categorie_parente: 900
        };
        chai.request(app)
            .post("/categories")
            .send(categ)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
      //Categorie parente is a final sous categorie
      it("It should not POST a categorie with categorie_parent that is a final sous categorie", (done) => {
        const categ = {
            nom_categorie: "nom du categorie",
            categorie_parente: 4
        };
        chai.request(app)
            .post("/categories")
            .send(categ)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
    });

    // PUT 
    describe("PUT /categories/:id", () => {
        //Success
        it("It should PUT a categorie that exists", (done) => {
            const categorieId = 66;
            const categ =     {
                nom_categorie: "New",
                categorie_parente: null
            };
            chai.request(app)
                .put("/categories/" + categorieId)
                .send(categ)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id_categorie').eq(66);
                    response.body.should.have.property('nom_categorie').eq("New");
                    response.body.should.have.property('categorie_parente').eq(null);
                done();
                });
        });
        // Empty request
        it("It should not PUT with an empty request", (done) => {
                    const categorieId = 66;
                    const categ = {
        
                    };

                    chai.request(app)
                    .put("/categories/" + categorieId)
                    .send(categ)
                        .end((err, response) => {
                            response.should.have.status(400);
                        done();
                        });
        });

        //Categorie that does not match the schema 
        it("It should not PUT a categorie that does not match the schema", (done) => {
    const categorieId = 66;
    const categ =     {
        nom_categorie: "",
        categorie_parente: null
    };
    chai.request(app)
        .put("/categories/" + categorieId)
        .send(categ)
        .end((err, response) => {
            response.should.have.status(400);
            //?

        done();
});
        });


        //No matching categorie parente 
        it("It should not PUT a categorie with categorie_parent that does not exist", (done) => {
            const categorieId = 66;
            const categ = {
            nom_categorie: "nom du categorie",
            categorie_parente: 900
        };
        chai.request(app)
        .put("/categories/" + categorieId)
            .send(categ)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
             //Categorie parente is a final sous categorie
      it("It should not PUT a categorie with categorie_parent that is a final sous categorie", (done) => {
        const categorieId = 66;
        const categ = {
            nom_categorie: "nom du categorie",
            categorie_parente: 4
        };
        chai.request(app)
        .put("/categories/" + categorieId)
        .send(categ)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
    });
        //No matching categorie 
        it("It should not PUT a categorie that does not exist", (done) => {
            const categorieId = 700;
            const categ =     {
            nom_categorie: "New",
            categorie_parente: null
            };
            chai.request(app)
            .put("/categories/" + categorieId)
            .send(categ)
            .end((err, response) => {
                response.should.have.status(400);
                
    
            done();
            });
            });

    // DELETE 
    describe("DELETE /categories/:id", () => {
        //Sucess
        it("It should DELETE a categorie that exists", (done) => {
            const categorieId = 24;
            chai.request(app)
                .delete("/categories/" + categorieId)
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
        // No matching categorie = does not exist so it cannot be modified
        it("It should NOT DELETE a categorie that does not exist", (done) => {
            const categorieId = 800;
            chai.request(app)
                .delete("/categories/" + categorieId)
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

    });


});
//PRODUITS
describe('produits APIs', () => {
    //GET produits
    // Success
        describe("GET produits /produits", () => {
            it("It should GET all the produits", (done) => {
                chai.request(app)
                    .get("/produits")
                    .end((err, response) => {
                        response.should.have.status(200);
                        // list objets
                         response.body.should.be.a('array');
                        // list non vide
                         response.body.length.should.not.be.eq(0);
                    done();
                    });
            });
    // //No produits = Empty array
    //         it("It should not GET an empty array", (done) => {
    //             chai.request(app)
    //                 .get("/produits")
    //                 .end((err, response) => {
    //                     response.should.have.status(400);
                        
    //                 done();
    //                 });
    //         });
    
        });
    
        // GET USING ID
        describe("GET /produits/:id", () => {
            it("It should GET the matching produit", (done) => {
                const produitId = 61;
                chai.request(app)
                    .get("/produits/" + produitId)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('id_produit').eq(61);
                        response.body.should.have.property('categorie');
                        response.body.should.have.property('nom_produit');
                        response.body.should.have.property('marque');
                        response.body.should.have.property('couleur');
                        response.body.should.have.property('disponibilite');
                        response.body.should.have.property('prix');
                        response.body.should.have.property('description');
                        
                    done();
                    });
            });
            // No matching produit
it("It should not GET a produit with this id", (done) => {
    const produitId = 900;
    chai.request(app)
        .get("/produits/" + produitId)
        .end((err, response) => {
            response.should.have.status(400);
        done();
        });
});
        });
    // POST 
    describe("POST /produits", () => {
        // Success
       it("It should POST a new produit", (done) => {
           const prod = {

            categorie: 3,
            nom_produit:"200",
            marque: "1",
            couleur: "12",
            image: "123456",
            disponibilite: 1,
            prix: 1,
            description: "1"
           };
           chai.request(app)
               .post("/produits")
               .send(prod)
               .end((err, response) => {
                   response.should.have.status(200);
                   response.body.should.be.a('object');
                   response.body.should.have.property('id_produit')
                   response.body.should.have.property('categorie').eq(3);
                   response.body.should.have.property('nom_produit').eq("200");
                   response.body.should.have.property('marque').eq("1");
                   response.body.should.have.property('couleur').eq("12");
                   response.body.should.have.property('image').eq("123456");
                   response.body.should.have.property('disponibilite').eq(1);
                   response.body.should.have.property('prix').eq(1);
                   response.body.should.have.property('description').eq("1"); 
                  done();
               });
       });
               
       // Empty request
       it("It should not POST with an empty request", (done) => {
           const prod = {

           };
           chai.request(app)
               .post("/produits")
               .send(prod)
               .end((err, response) => {
                   response.should.have.status(400);
               done();
               });
       });
       // produit that does not match the schema
       it("It should not POST a produit that does not match the schema", (done) => {
        const prod =     {

            categorie: 3,
            nom_produit:"",
            marque: "",
            couleur: "",
            image: "",
            disponibilite: 1,
            prix: 83500,
            description: ""
                };
           chai.request(app)
               .post("/produits")
               .send(prod)
               .end((err, response) => {
                   response.should.have.status(400);
               done();
               });
       });

      // produit exists
       it("It should not POST a produit that exists", (done) => {
           const prod = {
            categorie: 20,
            nom_produit: "Generies Stylet écrans Tactile,Capacitif Stylo Universel pour/Téléphone/Tablett/Android/Apple/iPhone/iPad Pro/Mini/Air/Surface/Samsung/LG/Autres Tactil écrans",
            marque: "Generies",
            couleur: "Blanc",
            image: "https://m.media-amazon.com/images/I/71qOnJLcnWL._AC_SX466_.jpg",
            disponibilite: 1000,
            prix: 1099,
            description: "     Caractéristiques : corps du stylo cylindrique en aluminium, la position de la pointe du disque est reliée par des billes métalliques en acier pour améliorer la durée de vie et une double durabilité. Ce disque transparent est remplaçable, offrant une expérience d'écriture fluide pour vos tablettes tactiles et smartphones. Utilisez le stylet Pony pour sélectionner facilement l'icône, le défilement, le dessin et les jeux     √ Stylets pour poney : design moderne au design traditionnel, capuchon magnétique bidirectionnel pour une apparence élégante, pas besoin de tordre ou pousser le chapeau vers l'arrière, il suffit de mettre le chapeau près du stylo, les deux côtés vont absorber automatiquement.     √ Pratique : design spécial des embouts de disque cachés. Les pointes du disque de rechange sont cachées à l'intérieur du capuchon du stylo. Il peut vous assurer que vous pouvez utiliser le stylo en cas d'urgence lorsque le disque est cassé ou perdu. Pas besoin de transporter la boîte entière. Ce stylet dispose également d'un étui en cuir, vous permettant de transporter le stylo dans n'importe quelle situation.     √ Produits compatibles : prêt à l'emploi lorsque vous retirez le capuchon du stylo. Facile à utiliser sur Apple iPad, iPad Mini, iPad Pro, iPhone, tablette Android, téléphone Android, Samsung Galaxy, Microsoft et autres appareils à écran tactile capacitif.     Contenu : 1 stylet, 1 disque remplaçable, 1 étui en cuir."
        };
           chai.request(app)
               .post("/produits")
               .send(prod)
               .end((err, response) => {
                   response.should.have.status(400);
               done();
               });
       });
     //No matching categorie 
       it("It should not POST a produit with categorie that does not exist", (done) => {
       const prod = {
        categorie: 121,
        nom_produit:"nom",
        marque: "",
        couleur: "couleur",
        image: "image1",
        disponibilite: 1,
        prix: 83500,
        description: "description"
       };
       chai.request(app)
           .post("/produits")
           .send(prod)
           .end((err, response) => {
               response.should.have.status(400);
           done();
           });
       });
     //Categorie is not a final sous a categorie
     it("It should not POST a produit with categorie that is not a final sous categorie", (done) => {
        const prod = {
         categorie: 1,
         nom_produit:"nom",
         marque: "",
         couleur: "couleur",
         image: "image1",
         disponibilite: 1,
         prix: 83500,
         description: "description"
        };
        chai.request(app)
            .post("/produits")
            .send(prod)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
   });

    // PUT 
    describe("PUT /produits/:id", () => {
        //Success
        it("It should PUT a produit that exists", (done) => {
            const produitId = 70;
            const prod =     {
                categorie: 10,
                nom_produit:"100",
                marque: "1",
                couleur: "12",
                image: "123456",
                disponibilite: 1,
                prix: 1,
                description: "1"
            };
            chai.request(app)
                .put("/produits/" + produitId)
                .send(prod)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                   response.body.should.have.property('id_produit').eq(70);
                   response.body.should.have.property('categorie').eq(10);
                   response.body.should.have.property('nom_produit').eq("100");
                   response.body.should.have.property('marque').eq("1");
                   response.body.should.have.property('couleur').eq("12");
                   response.body.should.have.property('image').eq("123456");
                   response.body.should.have.property('disponibilite').eq(1);
                   response.body.should.have.property('prix').eq(1);
                   response.body.should.have.property('description').eq("1");
                done();
                });
        });
        // Empty request
        it("It should not PUT with an empty request", (done) => {
                    const produitId = 66;
                    const prod = {
        
                    };

                    chai.request(app)
                    .put("/produits/" + produitId)
                    .send(prod)
                        .end((err, response) => {
                            response.should.have.status(400);
                        done();
                        });
        });

        //produit that does not match the schema 
        it("It should not PUT a produit that does not match the schema", (done) => {
    const produitId = 66;
    const prod =     {          
        categorie: 3,
        nom_produit:"",
        marque: "1",
        couleur: "12",
        image: "1",
        disponibilite: 1,
        prix: 1,
        description: "1"

    };
    chai.request(app)
        .put("/produits/" + produitId)
        .send(prod)
        .end((err, response) => {
            response.should.have.status(400);
            //?

        done();
});
        });
 

        //No matching categorie 
        it("It should not PUT a produit with categorie that does not exist", (done) => {
            const produitId = 66;
            const prod = {
            categorie: 900,
            nom_produit:"nom",
            marque: "",
            couleur: "couleur",
            image: "image1",
            disponibilite: 1,
            prix: 83500,
            description: "description"
        };
        chai.request(app)
        .put("/produits/" + produitId)
            .send(prod)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
             //Categorie is not a final sous a categorie
     it("It should not POST a produit with categorie that is not a final sous categorie", (done) => {
        const produitId = 66;

        const prod = {
         categorie: 1,
         nom_produit:"nom",
         marque: "",
         couleur: "couleur",
         image: "image1",
         disponibilite: 1,
         prix: 83500,
         description: "description"
        };
        chai.request(app)

        .put("/produits/" + produitId)
            .send(prod)
            .end((err, response) => {
                response.should.have.status(400);
            done();
            });
        });
               //No matching produit 
               it("It should not PUT a produit that does not exist", (done) => {
                const produitId = 700;
                const prod =     {
                    categorie: 3,
                    nom_produit:"200",
                    marque: "1",
                    couleur: "12",
                    image: "123456",
                    disponibilite: 1,
                    prix: 1,
                    description: "1"
          
                };
                chai.request(app)
                .put("/produits/" + produitId)
                .send(prod)
                .end((err, response) => {
                    response.should.have.status(400);
                    
        
                done();
                });
                });
    });

        // DELETE 
        describe("DELETE /produits/:id", () => {
            //Sucess
            it("It should DELETE a produit that exists", (done) => {
                const produitId = 24;
                chai.request(app)
                    .delete("/produits/" + produitId)
                    .end((err, response) => {
                        response.should.have.status(200);
                    done();
                    });
            });
            // No matching produit = does not exist so it cannot be modified
            it("It should NOT DELETE a produit that does not exist", (done) => {
                const produitId = 800;
                chai.request(app)
                    .delete("/produits/" + produitId)
                    .end((err, response) => {
                        response.should.have.status(400);
                    done();
                    });
            });
    
        });
    
    });
