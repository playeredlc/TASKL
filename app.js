require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname+'/date.js');

const app = express();
let port = process.env.PORT;
const persList = [];
const defaultData = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//CONNECT TO DB
mongoose.connect('mongodb+srv://'+ process.env.DB_USER +':'+ process.env.DB_PASS +'@cluster0.k8whr.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = new mongoose.Schema({
  //(docs) If you want to add additional keys later, use the Schema#add method.
  task: {
    type: String, 
    required: true
  },
  list: {
    type: String, 
    required: true
  }
});
const Item = mongoose.model('Item', itemSchema);

//DEFAULT DATA
defaultData.push(new Item({task: 'Welcome to your TASKList', list: 'Quick list'}));
defaultData.push(new Item({task: 'Hit the + button to add a new task', list: 'Quick list'}));
defaultData.push(new Item({task: 'Use the checkbox to discard accomplished tasks.', list: 'Quick list'}));

// ROOT ROUTE
app.get('/', (req, res) => {
  let listTitle = 'Quick list';
  Item.find({list: listTitle}, (err, items) => {
    if(items.length === 0){
      //insert default
      Item.insertMany(defaultData, (err) => {
        if(!err){
          res.redirect('/');
        }
      });
    }else{
      res.render('list', {
        date: date.getDate(),
        listTitle: listTitle,
        list: items
      });
    }
  });
});

//DYNAMIC ROUTING FOR OTHER LISTS.
app.get('/:listName', (req, res) => {
  let listTitle = _.capitalize(req.params.listName);
  Item.find({list: listTitle}, (err, items) => {
    if(!err){
      res.render('list',{
        date: date.getDate(),
        listTitle: listTitle,
        list: items
      });      
    }
  });
});

//HANDLE NEW TASKS BEING ADDED.
app.post('/', (req, res) => {
  const item = new Item({
    task: req.body.newItem,
    list: req.body.list
  });
  item.save();
  res.redirect('/'+req.body.list);
});

//HANDLE DELETIONS
app.post('/delete', (req, res) => {
  Item.findByIdAndDelete(req.body.checkbox, (err) => {
    if(!err){
      res.redirect('/'+req.body.listName);
    }  
  });
});

if(port == null || port == ''){
  port=3000;
}
app.listen(port, () => {
  console.log('started at port 3000..');
});