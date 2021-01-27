require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname+'/date.js');

const app = express();
let port = process.env.PORT;
const persList = [];
// const defaultData = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//CONNECT TO DB
mongoose.connect('mongodb+srv://'+ process.env.DB_USER +':'+ process.env.DB_PASS +'@cluster0.k8whr.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const listSchema = new mongoose.Schema({
  name: String,
  items: Array
});
const userSchema = new mongoose.Schema({
  username: String,
  lists: [listSchema]
});
const User = mongoose.model('User', userSchema);
const List = mongoose.model('List', listSchema);

const defaultList = new List({
  name: 'Quick List',
  items: ['Welcome to your TASKList', 'Hit the + button to add a new task', 'Use the checkbox to discard accomplished tasks.']
});

// ROOT ROUTE
app.get('/', (req, res) => {
  
  User.findOne({username: 'playeredlc'}, (err, user) => {
    if(!err){
      res.render('list', {
        date: date.getDate(),
        listTitle: user.lists[0].name,
        list: user.lists[0],
        userID: user._id
      });
    }else{
      console.log(err);
    }
  });

});

//HANDLE NEW TASKS BEING ADDED.
app.post('/', (req, res) => {
  const newItem = req.body.newItem;
  const listID = req.body.listID;
  const userID = req.body.userID;

  User.findById(userID, (err, user) => {
    if(!err){
      user.lists.id(listID).items.push(newItem);
      user.save(() => {
        res.redirect('/');     
      });
    }else{
      console.log(err);
    }
  });
  
});

//HANDLE DELETIONS
app.post('/delete', (req, res) => {
  const itemIndex = req.body.itemIndex;
  const listID = req.body.listID;
  const userID = req.body.userID;

  User.findById(userID, (err, user) =>{
    user.lists.id(listID).items.splice(itemIndex, 1);
    user.save(()=>{
      res.redirect('/');
    });
  });

});

app.get('/sign-in', (req, res) => {
  res.render('sign-in', {
    date: date.getDate()
  });
});
app.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    date: date.getDate()
  })
});
//DYNAMIC ROUTING FOR OTHER LISTS.
// app.get('/:listName', (req, res) => {
  //   let listTitle = _.capitalize(req.params.listName);
//   Item.find({list: listTitle}, (err, items) => {
  //     if(!err){
//       res.render('list',{
  //         date: date.getDate(),
  //         listTitle: listTitle,
  //         list: items
  //       });      
  //     }
  //   });
  // });
  

if(port == null || port == ''){
  port=3000;
}
app.listen(port, () => {
  console.log('started at port 3000..');
});