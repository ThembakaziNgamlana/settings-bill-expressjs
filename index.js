const express = require('express');
const {engine}= require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const app = express();
const settingsBill = SettingsBill();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');3

app.set('views', './views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.render('index', {
     settings: settingsBill.getSettings});
});

app.post('/settings', function(req, res){
    console.log(req.body);

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    console.log(settingsBill.getSettings());
    res.redirect('/');
});

app.post('/action', function(req, res){

});

app.post('/actions', function(req, res){

});

app.post('/actions/:type', function(req, res){

});

const PORT = process.env.PORT || 3011

app.listen(PORT, function(){
    console.log("App started at port", PORT);
});

