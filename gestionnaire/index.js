

const sqlite3 = require('sqlite3').verbose();


var  db = new sqlite3.Database('etablissements.db'); // Utilise une base en mémoire pour cet exemple
//db.run("CREATE TABLE etablissements (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,user TEXT,motpass TEXT,descrip TEXT)");
let etabli=""
//db.serialize(() => {
 //   db.run("CREATE TABLE etablissements (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,user TEXT,motpass TEXT,descrip TEXT)");
  //  db.run("CREATE TABLE utilisateurs (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, email TEXT)");
//});

module.exports = db;
const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const session=require("express-session");


const app = express();
app.use(express.static('public'))
const PORT = 3000;
app.use( session({
    secret:"fdlfdv",
    resave: false,
    saveUninitialized:false,
    cookie:{secure:false}
}))

//// fuction
function dataClasse(ecole){
    
}

//
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// Route pour afficher le formulaire
app.get('/',(req,res)=>{ 
    if(req.session.user){
        datac={ user:req.session.user,etabli:req.session.etabli}
        res.render("utilisateur",datac)
    }else{
        //res.render('connexion')
        res.render('connexion')
    }
app.get("/scoole",(req,res)=>{
    if(req.session.user){
        datac={ user:req.session.user,etabli:req.session.etabli}
        res.render("scoole",datac)
    }else{
        //res.render('connexion')
        res.render("scoole")
    }
})
    //res.render("scoole")
})
app.get("/classe",(req,res)=>{
    if(req.session.user){
        const dbc= new sqlite3.Database(req.session.etabli+'.db')
    dbc.all("SELECT * FROM  classes ",[],(err, rows) =>{
        if(err){
            console.log(err)
        }
        console.log(rows)
        let r=rows
        datac={ user:req.session.user,etabli:req.session.etabli,cl:r}
        res.render("classe",datac)
    })
    console.log(datac)
        
    }else{
        //res.render('connexion')
       

        datac={ user:req.session.user,etabli:req.session.etabli}
       res.render("connexion",datac)
    }
    
})
app.get("/inscription",(req,res)=>{
    console.log(req.session.etabli)
    if(req.session.user){
        console.log(req.session.etabli)
    var  dbetabli = new sqlite3.Database(req.session.etabli+'.db')
    console.log(req.session.etabli)
    dbetabli.serialize(()=>{
        dbetabli.all("SELECT * FROM classes", [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            const r=rows
            datac={ user:req.session.user,etabli:req.session.etabli,clas:r}
            res.render("inscription",datac)

    })

    })
    }else{
        //res.render('connexion')
        datac={ user:req.session.user,etabli:req.session.etabli}
       res.render("connexion")
    }
    
})
app.get("/connexion",(req,res)=>{
    if (req.session.user){
        res.render("utilisateur",{user:req.session.user})
    }
    res.render("connexion")
})
app.get("/ajouter",(req,res)=>{
    if(req.session.user){
        datac={ user:req.session.user,etabli:req.session.etabli}
        res.render("form",datac)
    }else{
        //res.render('connexion')
        datac={ user:req.session.user,etabli:req.session.etabli}
       res.render("connexion",datac)
    }

})
app.post("/connexion",(req,res)=>{
    let clas=0
    let elevet=0
         
    db.serialize(()=>{
        const { nom,user,motpass } = req.body;
        etabli=nom
        db.all("SELECT * FROM etablissements", [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            //console.log(rows)
            rows.forEach(ok => {
                if(ok.nom==nom & ok.user==user & ok.motpass==motpass){
                    noms=ok.user
                    console.log("connecter")
                    req.session.user=user
                    req.session.etabli=nom
                   
                }
            });
            if (req.session.user){
                var  eleve = new sqlite3.Database(req.session.etabli+'.db')
                eleve.all("SELECT * FROM eleves", [], (err, rows) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    rows.forEach(element => {
                        elevet+=1
                        //console.log(element)
                        
                    });
                    
            })
            eleve.all("SELECT * FROM classes", [], (err, rows) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        
                        rows.forEach(element => {
                            clas+=1
                            console.log(element)
                        });
                 
                datac={ user:req.session.user,etabli:req.session.etabli,elevett:elevet, classes:clas}         
                res.render("utilisateurs", datac);
        })
                
            }else{
                res.render('connexion');

            }
            
        });

    })
})

app.post("/inscription",(req,res)=>{
    let effectif=0
  
    //console.log(req.body)
    let nom=req.body.nom 
    let prenom=req.body.prenom
    let dateins=" date inscription"
    let genre=req.body.genre
    let age=req.body.age
    let nomclass=req.body.nomclass
    let cycle=req.body.cycle
    let prenomp=req.body.prenomp
    let tel=req.body.tel
    let adress=req.body.address
    //console.log(req.body.nomclass)
   
    // let bag=[nom,prenom,dateins,genre,age,nomclass,cycle,prenomp,tel,adress]
   
    let nouvelEffectif=0
    var  dbetabli = new sqlite3.Database(req.session.etabli+'.db')
    dbetabli.serialize(() => {
        dbetabli.all("SELECT * FROM classes", [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(rows.length)
            rows.forEach(element => {
                elevet+=1
                //console.log(element)
                
            });
           
            dbetabli.all("SELECT effectifs FROM classes WHERE nom='" + nomclass + "'", function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(rows);
                    nouvelEffectif=rows[0].effectifs+1
                }
            });

            dbetabli.run("BEGIN TRANSACTION;", function(err) {
                if (err) {
                    console.log("Erreur lors de l'ouverture de la transaction : ", err);
                } else {
                    dbetabli.run("UPDATE classes SET effectifs = ? WHERE nom = ?", [nouvelEffectif, nomclass], function(err) {
                        if (err) {
                            console.log("Erreur lors de la mise à jour : ", err);
                        } else if (this.changes === 0) {
                            console.log("Aucune ligne n'a été mise à jour.");
                        } else {
                            console.log(`Mise à jour réussie. Nombre de lignes modifiées : ${this.changes}`);
                            dbetabli.run("COMMIT;", function(err) {
                                if (err) {
                                    console.log("Erreur lors du commit : ", err);
                                } else {
                                    console.log("Transaction enregistrée avec succès.");
                                }
                            });
                        }
                    });
                }
            });
        dbetabli.run("INSERT INTO eleves (nom,prenom,dateins,age,genre,cycle,nomclass,nomp,tel,adress) VALUES (?,?,?,?,?,?,?,?,?,?)", [nom,prenom,dateins,age,genre,cycle,nomclass,prenomp,tel,adress], function(err) {
            if (err) {
                console.log(err.message);
            }
        })


    })
  
    var  eleve = new sqlite3.Database(req.session.etabli+'.db')
    let elevet=0
    let clas=0
                eleve.all("SELECT * FROM eleves", [], (err, rows) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    elevet=0
                    rows.forEach(element => {
                        elevet+=1
                        //console.log(element)
                        
                    });
                    
            })
            eleve.all("SELECT * FROM classes", [], (err, rows) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        
                        rows.forEach(element => {
                            clas+=1
                            //console.log(element)
                        });
                 
    datac={ user:req.session.user,etabli:req.session.etabli,elevett:elevet, classes:clas}           

    //console.log(datac)
    res.render("utilisateurs", datac);
                    })})
})
app.post("/etablissement",(req,res)=>{
    db.serialize(() => {
        const { nom,user,motpass,descrip } = req.body;
        console.log(nom)
       db.run("INSERT INTO etablissements (nom,user,motpass,descrip) VALUES (?, ?,?,?)", [nom,user,motpass,descrip], function(err) {
        if (err) {
            console.log(err.message);
        }
    })
    try {
        let data= new sqlite3.Database(nom+'.db'); // creation de la db etablissement
        //crere la table des elves
        data.serialize(()=>{
        const info="CREATE TABLE eleves (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,prenom TEXT,dateins DATE,age DATE,genre TEXT,cycle TEXT,nomclass TEXT,nomp TEXT,tel TEXT,adress TEXT,moi1 TEXT,moi2 TEXT,moi3 TEXT,moi4 TEXT,moi5 TEXT,moi6 TEXT,moi7 TEXT,moi8 TEXT,moi9 TEXT,rest NUMBER)"
        //console.log(info)
        data.run(info);
        //crer la table des classes
        data.run("CREATE TABLE classes (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,cycle TEXT,effectifs INTEGER)");
        data.run("INSERT INTO classes (nom,cycle,effectifs) VALUES (?, ?,?)", ["jardin","0",0], function(err) {
            if (err) {
                console.log(err.message);
            }
        })
        data.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,username TEXT,motpass TEXT,statut text)");
        const statut="super"
        data.run("INSERT INTO user (nom,username,motpass,statut) VALUES (?, ?,?,?)", [nom,user,motpass,statut], function(err) {
            if (err) {
                console.log(err.message);
            }
        })
        //la table de statistique
        data.run("CREATE TABLE statistique (id INTEGER PRIMARY KEY AUTOINCREMENT,nom TEXT,cycle TEXT,effectis INTEGER,prix INTEGER,total INTEGER,toatalpayé INTEGER)");
        res.render("connexion")
        
    }) }catch (error) {
            message="Ce t'établissement est déja crée"
            res.render("scoole",message)
            
        }

    }


    )})
app.post("/classe",(req,res)=>{
    let {nom,cycle}=req.body;
    //console.log(nom)
    let effectif=0;
    let data= new sqlite3.Database(req.session.etabli+'.db'); // connexion à db etablissement
    //console.log(req.session.etabli)
    data.serialize(()=>{
        data.run("INSERT INTO classes (nom,cycle,effectifs) VALUES (?,?,?)", [nom,cycle,effectif], function(err) {
            if (err) {
                console.log(err.message);
            }
        })
        
        if (req.session.user){
            let clas=0
            let elevet=0
            var  eleve = new sqlite3.Database(req.session.etabli+'.db')
            eleve.all("SELECT * FROM eleves", [], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                rows.forEach(element => {
                    elevet+=1
                    //console.log(element)
                    
                });
                
        })
        eleve.all("SELECT * FROM classes", [], (err, rows) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    
                    rows.forEach(element => {
                        clas+=1
                        console.log(element)
                    });
             
            datac={ user:req.session.user,etabli:req.session.etabli,elevett:elevet, classes:clas}         
            res.render("utilisateurs", datac);
    })
            
        }else{
            res.render('connexion');

        }

    })
    
})














// Lancement du serveur$
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});