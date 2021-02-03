const express = require('express')
const fileIO = require('./lib/fileIO.js');
const bodyParser = require('body-parser');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const content = require('./lib/content.js');
const auth = require('./lib/auth.js');

var authData = {
  email: 'thinkCat@gmail.com',
  password: "123456",
  nickname: "thinkCat"
}

const upload = multer({storage:storage});

const app = express()  //application 객체
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

app.get('/', (request, response) => {
  fileIO.home(request, response)
})

app.get('/cat/:catId', (request, response) => {
  fileIO.catInfo(request, response)
})

app.get('/create', (request, response) => {
  fileIO.create(request, response)
})

app.post('/process_create', upload.single('img'),(request, response) => {
  fileIO.process_create(request, response)
})

app.get('/update/:catId', (request, response) => {
  fileIO.update(request, response)
})

app.post('/process_update', upload.single('img'), (request, response) => {
  fileIO.process_update(request, response)
})

app.post('/process_delete' ,(request, response) => {
  fileIO.process_delete(request, response)
})

app.get('/auth/login', (request, response) => {
  fileIO.login(request, response)
})

app.post('/auth/process_login', (request, response) => {
  fileIO.process_login(request, response);

})

app.get('/auth/logout', (request, response) => {
  fileIO.process_logout(request, response)
})

app.listen(port, () => {
})
