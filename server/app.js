var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var routes = require('./routes/index');
// var users = require('./routes/users');

var bcrypt = require('bcryptjs');
var cors = require('cors');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var multer = require('multer');


var User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  fullname: String,
  accessToken: String
}));

var Photo = mongoose.model('Photo', new mongoose.Schema({
  url: String,
  timestamp: String,
  description: String,
  uploadBy: String
}));

mongoose.connect(config.db);


var app = express();

// view engine setup
// app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', routes);
// app.use('/users', users);

function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };

  return jwt.encode(payload, config.tokenSecret);
}

function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'No Token.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();

  if (now > payload.exp) {
    return res.status(401).send({ message: 'Token has expired.' });
  }

  User.findById(payload.sub, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User does not exist.' });
    }

    req.user = user;
    next();
  })
}

app.get('/protected', isAuthenticated, function(req, res) {
  // Prints currently signed-in user object
  console.log(req.user);
});

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: { email: 'This user does not exist.' } });
    }

    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: { password: 'The password is not correct.' } });
      }

      user = user.toObject();
      delete user.password;

      var token = createToken(user);
      res.send({ token: token, user: user });
    });
  });
});

app.post('/auth/reg', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }

    var user = new User({
      email: req.body.email,
      password: req.body.password,
      fullname: req.body.fullname
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;

        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});

// file upload, ref: https://code.ciphertrick.com/2015/12/07/file-upload-with-angularjs-and-nodejs/
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var upload = multer({ //multer settings
  storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload', isAuthenticated, function(req, res) {
  upload(req,res,function(err){
    if(err){
      res.json({error_code:1, err_desc:err});
      return;
    }

    var photo = new Photo({
      timestamp: Date.now(),
      uploadBy: req.user._id,
      url: req.file.filename
    });
    photo.save(function() {

    });

    res.json({error_code:0, err_desc:null});
  })
});

app.get('/feed', isAuthenticated, function(req, res, next) {
  var photos = mongoose.model('Photo');
  photos
      .find({
        "uploadBy": req.user._id
      })
      .sort({"timestamp": -1})
      .exec(function(err, p){
        return res.end(JSON.stringify(p));
      });
});

app.get('/photo/:id', function (req, res, next) {
  var photo = mongoose.model('Photo');
  photo.findById(req.params.id).lean().exec(function(err, p) {
    var user  = mongoose.model('User');
    user.findById(p.uploadBy).lean().exec(function(err, u) {
      p['user'] = u;
      return res.end(JSON.stringify(p));
    });
  });
});

app.post('/updateCaption', function(req, res) {
  Photo.findOneAndUpdate({_id: req.body.id}, {
    $set: {description: req.body.description}
  }, {new: true}, function(err, photo) {
    var doc = photo.toObject();
    doc['status'] = 'ok';
    return res.end(JSON.stringify(doc));
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
