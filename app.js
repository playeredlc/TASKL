require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname+'/date.js');

const app = express();
const PORT = 3000;
const quickList = [];
const persList = [];
const defaultData = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//CONNECT TO DB
mongoose.connect('mongodb://localhost:27017/tasklDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  //(docs) If you want to add additional keys later, use the Schema#add method.
  task: String,
  active: Boolean
});
const Item = mongoose.model('Item', itemSchema);

//DEFAULT DATA
defaultData.push(new Item({
  task: 'Welcome to your TASKList',
  active: true
}));
defaultData.push(new Item({
  task: 'Hit the + button to add a new task',
  active: true
}));
defaultData.push(new Item({
  task: 'Use the checkbox to discard accomplished tasks.',
  active: true
}));

// ROOT ROUTE
app.get('/', (req, res) => {
  let listTitle = 'Quick List';
  Item.find({}, (err, items) => {
    console.log(items.length);
    if(items.length === 0){
      //insert default
      Item.insertMany(defaultData, (err) => {
        if(err){
          console.log(err);
        }else{
          console.log('Succesfully inserted default values.');
        }
      });
      res.redirect('/');
    }else{
      res.render('list', {
        date: date.getDate(),
        listTitle: listTitle,
        list: items
      });
    }
  });
});
app.post('/', (req, res) => {
  if(req.body.list === 'Personal'){
    persList.push(req.body.newItem);
    res.redirect('/Personal');
  }else{
    const item = new Item({
      task: req.body.newItem,
      active: true
    });
    item.save();
    res.redirect('/');
  }
});

app.post('/delete', (req, res) => {
  console.log(req.body);
  Item.deleteOne({_id: req.body.checkbox}, (err) => {
    if(err){
      console.log(err);
    }else{
      console.log('Succesfully deleted.');
      res.redirect('/');
    }
  })
});

// PERSONAL LIST ROUTE (CHANGE TO DYNAMIC ROUTING??)
app.get('/Personal', (req, res) => {
  let listTitle = 'Personal List';
  res.render('list', {
    date: date.getDate(),
    listTitle: listTitle,
    list: persList
  });
});

app.listen(PORT, () => {
  console.log('started at port 3000..');
});