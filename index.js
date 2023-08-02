const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const app = express();
const settingsBill = SettingsBill();

// Create an instance of express-handlebars with the required configuration
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
});

// Configure the view engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Set the views directory
app.set('views', './views');



app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('index', { 
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals()
  });
});

app.post('/settings', function (req, res) {
  // Set the settings when the form is submitted
  settingsBill.setSettings({
    callCost: parseFloat(req.body.callCost),
    smsCost: parseFloat(req.body.smsCost),
    warningLevel: parseFloat(req.body.warningLevel),
    criticalLevel: parseFloat(req.body.criticalLevel),
  });

  res.redirect('/');
});

app.post('/action', function (req, res) {
  settingsBill.recordAction(req.body.actionType)
  res.redirect('/');
});
app.get('/actions', function(req, res){
  res.render('actions',{actions: settingsBill.actions(

  )});
});



app.get('/actions/:type', function(req, res){
  const actionType = req.params.actionType;
 res.render('actions',{actions: settingsBill.actionsFor(actionType) });

});

const PORT = process.env.PORT || 3011;


app.listen(PORT, function () {
  console.log('App started at port', PORT);
});




