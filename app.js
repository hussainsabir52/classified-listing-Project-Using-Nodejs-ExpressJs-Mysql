const express= require('express');
const hbs=require('hbs');
const bodyParser=require('body-parser');
const session = require('express-session');
const mysql= require('mysql');
const path = require('path');


const viewsPath=path.join(__dirname,'views');
const partialPath=path.join(__dirname,"partials");

hbs.registerPartials(partialPath);

const app = express();
app.set('views',path.join(viewsPath));
app.set('view engine','hbs');

app.use('/assets',express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
res.render('home',{
    title:'Classified Listing'
});
});

app.listen('3000',()=>{
    console.log('App running on port 3000');
});