const express = require('express');
const bodyParser = require('body-parser');
const scrapping = require('./scrapping');
let dados = scrapping.module;
const ejs = require('ejs');
const app = express();
let db;

const mongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://tres_porcento:6Nt8TZBC7gxAAbRg@lcabrini0-xlalg.gcp.mongodb.net/test?retryWrites=true&w=majority";

console.log(dados);

mongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err);
        
    db = client.db('test');
    app.listen(3000, () =>{
        console.log("sevirdor rodando na porta 3000");
    });
    // salvar()
})


function salvar(){
    db.collection('data').insertMany(dados, (err, results) => {
        if(err) return console.log(err)

        console.log('dados salvos com sucesso')
    })

}

function index(){
    app.set('view-engine', 'ejs');
    // salvar()
    app.get('/', (req, res)=>{
        db.collection('data').find().toArray((err, results) => {
            if(err){
                console.log('deu o erro ' + err);
            }else{
                res.render('index.ejs', {data:results});
            }
        });
    });
}

