function errorHandler(err, req, res, next) {

  //It is important to implement some logic here to log the error somewhere.
  
  if(res.statusCode == 404) {
    req.session.returnPath = '/';
  } else {
    req.session.returnPath = req.path;
  }
  
  req.session.errMessage = err.message;

  res.redirect('/error');

};

module.exports = errorHandler;
