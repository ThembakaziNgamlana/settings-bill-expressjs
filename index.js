import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js'

const app = express();
const settingsBill = SettingsBill();

// Create an instance of express-handlebars with the required configuration
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutDir : "./views/layouts"
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
    totals: settingsBill.totals(),
    levelsCheck: settingsBill.levelsCheck()
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
  const actionType = req.params.type;
 res.render('actions',{actions: settingsBill.actionsFor(actionType) });

});

const PORT = process.env.PORT || 3011


app.listen(PORT, function () {
  console.log('App started at port', PORT);
});










