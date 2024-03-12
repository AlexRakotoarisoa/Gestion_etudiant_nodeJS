const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const fs = require("fs");
const { profile } = require("console");

const optionBd = {
    host : 'localhost',
    user : 'root',
    pasword : '',
    port : 3306,
    database : 'projet'
};

const app = express();
const storage = multer.diskStorage({
    destination : './Public/data/uploads/',
    filename : (req,file,cb) => {
        cb(null,file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
})
const upload = multer({storage});



//Pouravoir accès au données dans mon formulaire
app.use(express.urlencoded({extended:false}));

//Definition du middleware pour connecter pool est equivaut a la stratégie
app.use(myConnection(mysql,optionBd,'pool'));

//Definition des fichiers static
app.use(express.static('Public'));

//Definintion du moteur d'affichage
app.set("view engine","ejs");
app.set("views","IHM");



/*
const inputfile = 'all.jpg';/// atao ato le fichier azo avy amin'ny le file 
const outputfile = 'output.png';
const data = readImageFile(inputfile);
console.log(data)


app.query("insert into 'bindata' data values (binary(:data))",{data},function(err,res){
   if (err) throw err
   console.log('blob data inserted')

    app.query("Select * from 'bindata'", (err,res) => {
        const data = row.data
        console.log('blob data read')
        const buf = new Buffer(data,'binary')
        fs.writeFileSync(outputfile,buf)
    })
})


function readImageFile(file){
    const bitmap = fs.readFileSync(file);
    const buf = new Buffer(bitmap);
    return buf;
}
*/
















app.get("/",(req,res) => {
    req.getConnection((erreur,connection) => {
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('select * from etudian order by idEtudiant ASC',[],(erreur,resultat) => {
                if(erreur){
                    console.log(erreur)
                }else{
                    res.status(200).render("index",{resultat});
                }
            })
        }
    })

})


//Pour effectuer l'ajout et la modification
app.post("/ajout",upload.single('imageUpload'), (req,res) => {

    let id = req.body.id === "" ? null : req.body.id;
    let matr = req.body.matr;
    let nom = req.body.nom;
    let math = req.body.math;
    let phys = req.body.phys;
    let moyy = (parseFloat(math) + parseFloat(phys))/2;
    let moy = moyy.toFixed(2);
    let image1 = '';
    let image2 = '';

    if(req.file){
        image1 = req.file.filename;
    }else{
        image1 = 'profil.png';
    }
    

    let reqSQL = id === null 
        ? 'INSERT INTO etudian (idEtudiant,numEt,nom,note_math,note_phys,moyenne,image) values (?,?,?,?,?,?,?)' 
        : 'select image from etudian where idEtudiant = ?';

    let tbl = id === null 
        ? [null,matr,nom,math,phys,moy,image1] 
        : [id]

    req.getConnection((erreur,connection) => {
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(reqSQL,tbl,(erreur,lee) => {
                if(erreur){
                    console.log("erreur 1")
                }else{
                                if(id !== null){
                                    image2 = lee[0].image;// je recupère ici le nom de l'image dans la base de donnée

                                            if(image2 !== 'profil.png'){ // si nom récuperer de la base de donnée est différent de profil.png
                                                if(req.file){
                                                    image1 = req.file.filename;
                                                }else{
                                                    image1 = null;
                                                }
                                               
                                                if(image1 == null ){
                                                    connection.query('UPDATE etudian set numEt =?, nom = ?, note_math = ?, note_phys = ?,moyenne = ? where idEtudiant = ?',[matr,nom,math,phys,moy,id],(err) =>{
                                                        if(err){
                                                            console.error("erreur 2");
                                                        }
                                                        })
                                                }else{
                                                    connection.query('UPDATE etudian set numEt =?, nom = ?, note_math = ?, note_phys = ?,moyenne = ?,image = ? where idEtudiant = ?',[matr,nom,math,phys,moy,image1,id],(err) =>{
                                                        if(err){
                                                            console.error("erreur 3");
                                                        }
                                                    })
                                                    fs.unlink('./Public/data/uploads/'+image2+'',(error) => {
                                                        if(error){
                                                            console.error("erreur 4");
                                                        }
                                                    })
                                                }
                                            }else{ // si image2 est egal au profil
                                                if(req.file){
                                                    image1 = req.file.filename;
                                                }else{
                                                    image1 = 'profil.png';
                                                }
                                                connection.query('UPDATE etudian set numEt =?, nom = ?, note_math = ?, note_phys = ?,moyenne = ?,image = ? where idEtudiant = ?',[matr,nom,math,phys,moy,image1,id],(err) =>{
                                                    if(err){
                                                        console.error("erreur 6");
                                                    }
                                                    })
                                            }

                                            
                                    
                                }
                                res.status(300).redirect("/");  
                }
            })
        }
    })
   

})


// POUR EFFECTUER LA SUPRESSION
app.delete("/notes/:id",(req,res) => {
    let id = req.params.id;
    req.getConnection((erreur, connection) => {
        if(erreur){
            console.log(erreur);
            //
        }else{connection.query("SELECT image from etudian where idEtudiant = ?",[id],(erreur,resultat) =>{
                if(erreur){
                    console.log(erreur)
                }else{
                    const imageFilename = resultat[0].image;
                    if(imageFilename !== 'profil.png'){
                        fs.unlink('./Public/data/uploads/'+imageFilename+'',error => {
                            if(error){
                                console.error('Une erreur est survenu lors de la suppression de fichier :', error)
                                res.status(500).send('erreur de la suppression du fichier image')
                            }
                        });
                    }

                    connection.query('Delete from etudian where idEtudiant = ?',[id],(erreur) =>{
                        if(erreur){
                            console.error('Une erreur est survenu lors de la suppression de fichier :', error)
                            res.status(500).send('erreur de la suppression du fichier image')
                        }else{
                            res.status(200).json({routeRacine : '/'});
                        }
                    })

                    
                }
            }
    )}
    })
})



app.use((req,res) => {
    res.status(404).render("pageErreur");
})

app.listen(3002,() => {
    console.log('En attente des requête venant des clients')
})

