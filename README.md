
<h1 align="center">
	TASKL.
</h1>

<div align="center">

<strong>Easy-to-use task list developed to shape your day.</strong>

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/playeredlc/TASKL-tasklist/blob/master/LICENSE)

Check online: [usetaskl.herokuapp.com](https://usetaskl.herokuapp.com)

[About](#about-this-project)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Features](#features)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Tech](#technologies)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[How to run](#running-locally)&nbsp;&nbsp;&nbsp;

</div>


## About this project
TASKL is an easy-to-use task list. It was developed as a mobile-friendly web application which gives you access to your tasks anywhere.

This project was developed as part of my web development learning journey. During the development process of this application I got the opportunity to deal with different aspects of both client and server sides of the application.

To use [TASKL](https://usetaskl.herokuapp.com/) simply create your account or sign in with google and start managing your tasks.

## Features
* Group up your tasks in different lists;
* Manage your lists as you want;
* Easily join using your Google Account;

## Technologies
### Back-end:
* [Nodejs](https://nodejs.org/en/) with [Express](https://expressjs.com/)
* [Passport](http://www.passportjs.org/)
* [Google OAuth 2.0](http://www.passportjs.org/docs/oauth2-api/)

### Front-end:
* HTML / CSS / JavaScript
* [EJS](https://ejs.co/)
### Database:
* [MongoDB](https://www.mongodb.com/)
* [MongoDB Atlas](https://www.mongodb.com/atlas/database)
* [Mongoose](https://mongoosejs.com/)
### Deployment:
* [Heroku](https://devcenter.heroku.com/)

## Running locally
#### Pre-requisites:
To run this application you will need to install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Node](https://nodejs.org/en/download/) with NPM, your own cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (if you want to run mongodb locally, you must change the connection string in the config file). To properly use the Google OAuth, you will need to register and set up your application at [Google Cloud Platform](https://console.cloud.google.com/apis/dashboard).

#### Environment variables: 
In the root of the project there is a .env.example file. You will need to make your own .env including the variables related to your set up of Atlas and Google Cloud. As well as the other variables listed in the example file.


```bash
# clone this repository
$ git clone https://github.com/playeredlc/TASKL-tasklist

# go to the root of directory
$ cd TASKL-tasklist

# install the dependencies
npm install

# make sure you have written your .env file

# run the server using node or nodemon
node server.js

# you will find the server running at the selected port on your localhost
# http://localhost:PORT
```

<hr>

<strong><i> </> </i></strong> Developed by <strong>edlc</strong>. [Get in touch!](https://github.com/playeredlc) :metal:
