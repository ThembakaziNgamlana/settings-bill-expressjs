import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js'

const app = express();
const settingsBill = SettingsBill();


app.post('/reset', function (req, res) {
  settingsBill.reset();

  // Update levelsCheck based on current total
  const updatedLevelsCheck = settingsBill.levelsCheck();
  
  res.render('index', {
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals(),
    
  });
});



const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutDir : "./views/layouts",
  
  helpers: {
    formatTime: function (timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  formatTimeAgo: function (timestamp) {
    const actionTime = moment(timestamp); // Create a Moment.js object
    const currentTime = moment(); // Current time

    const duration = moment.duration(currentTime.diff(actionTime)); 
    const seconds = duration.asSeconds(); // Get the duration in seconds

    if (seconds < 60) {
      return `${Math.round(seconds)} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      
      return actionTime.format('MMM DD, YYYY hh:mm:ss A'); // Format using Moment.js
    }
  }

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
  if (!settingsBill.hasReachedCriticalLevel()) { // Corrected function name
    settingsBill.recordAction(req.body.actionType);
  }
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










