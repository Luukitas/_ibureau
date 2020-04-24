const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const ejs = require('ejs');
const app = express();
let lista = [];
const bodyParser = require('body-parser');

const mongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://tres_porcento:RgH6oNMa9H1DCGkO@cluster0-5pniq.mongodb.net/test";



// app.set('view-engine', 'ejs');

// app.listen(3000, () =>{
//     console.log("sevirdor rodando na porta 3000");
// })

mongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err);
        
    db = client.db('db_tres_porcento');
    app.listen(3000, () =>{
        console.log("sevirdor rodando na porta 3000");
    });
    // salvar()
})

axios.get('http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoConsulta&ordernarPor=1&ID=20&dsVerbete=Transporte&obj=6').then((res) => {
    const $ = cheerio.load(res.data);
    const onc = [];
    let x;

    $(".card-body").each((index, element) => {
        const on = $(element).children('a').first().attr('onclick');
        onc[index] = {on};
    })

    
    onc.forEach(element => {
        let v = element["on"] + "";
        v = v.substring(14,27);
        x = v.split(",");
        if(x != ""){
            let a = x[0]
            let b = x[1]
            let c = x[2]
            let d = x[3]

            links(a,b,c,d)
        }
           
    });
    
});

function links(a,b,c,d){
    axios.get('http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTexto&ID='+ a +'&inEspecie='+ b +'&nrProjeto='+ c +'&aaProjeto='+ d +'&dsVerbete=Transporte').then((res) => {
    
        const $ = cheerio.load(res.data);
        const titulo = $('.card-header > .card-title').first().text();
        const data = $('.card-header > .text-muted').text();
        const situacao = $(".col-lg > dl.row").first().children('dt').first().next().text();
        const assunto = $(".col-lg > dl.row").first().children('dt').last().prev().text();
        const autor = $('dd.col-sm-9').last().text();
        const ementa = $('div.card > div.card-body > p.card-text').first().text();
        const tramite = $('#idTramite > table.table > tbody').children().text();
    
        // console.log(tramite)

        lista = [{titulo , data, situacao, assunto, autor, ementa, tramite}]

        // salvar(lista)
        index();
        
    });
}

function salvar(dados){
    db.collection('tres_porcento').insertMany(dados, (err, results) => {
        if(err) return console.log(err)

        console.log('dados salvos com sucesso')
    })

}

function index(){
    app.set('view-engine', 'ejs');
    // salvar()
    app.get('/', (req, res)=>{
        db.collection('tres_porcento').find().toArray((err, results) => {
            if(err){
                console.log('deu o erro ' + err);
            }else{
                res.render('index.ejs', {data:results});
            }
        });
    });
}