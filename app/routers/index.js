var express = require('express');
var router = express.Router();
var app = express();

var bodyParser = require('body-parser');
const cors = require('cors');
// app.use(cors());

var apiController = require('./../controllers/apiController');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
// var corsOptions = {
//   origin: 'http://localhost:3001', // Replace with the origin of your frontend application
//   methods: ['GET', 'POST'], // Specify the allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
// };

// router.get('/', cors(corsOptions), apiController.movieLists);

// router.post('/signUp', cors(corsOptions), apiController.signUp);

// router.post('/login', cors(corsOptions), apiController.login);

// router.get('/userData', cors(corsOptions), apiController.userData);

// router.get('/refreshtoken', cors(corsOptions), apiController.refreshtoken);

// router.get('/validateAccessToken', cors(corsOptions), apiController.validateAccessToken);

router.get('/',  apiController.movieLists);

router.post('/signUp',  apiController.signUp);

router.post('/login', apiController.login);

router.post('/userData', apiController.userData);

router.post('/refreshtoken',apiController.refreshtoken);

router.post('/validateAccessToken', apiController.validateAccessToken);

module.exports = router;
