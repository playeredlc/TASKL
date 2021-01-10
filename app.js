require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname+'/date.js');

const app = express();
const PORT = 3000;
const quickList = ["Do something"];
const persList = [];

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
//LOAD FROM DB
Item.find((err, itens) => {
  if (err){
    console.log(err);
  }else{
    itens.forEach(element => {
      quickList.push(element.task);
      console.log(quickList);
    });
  }
});

// ROOT ROUTE
app.get('/', (req, res) => {
  let listTitle = 'Quick List';
  
  res.render('list', {
    date: date.getDate(),
    listTitle: listTitle,
    list: quickList
  });
});
app.post('/', (req, res) => {
  if(req.body.list === 'Personal'){
    persList.push(req.body.newItem);
    res.redirect('/Personal');
  }else{
    quickList.push(req.body.newItem);
    res.redirect('/');
  }
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

// EXAMPLE DATA
// const data = [
//   {
//     task: 'Buy food',
//     active: true
//   },
//   {
//     task: 'Cook food',
//     active: true
//   },
//   {
//     task: 'Eat food',
//     active: true
//   }
// ];
//INSERT DATA
// Item.insertMany(data, (err) => {
//   if(err){
//     console.log(err);
//   }else{
//     console.log('Successfuly added.');
//   }
// });