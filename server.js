const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
const Users = require('./models/user')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/add', (req, res, next) => {
  Users.findById(req.body.userId)
    .then((user) => {
      if(user != null){
        user.log.push(req.body)
        user.count = user.count + 1
        user.save()
          .then((user) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(user)
        }, (err) => next(err)) 
      } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end('Unknown Id')        
      }
    },  (err) => next(err))
    .catch((err) => next(err))
})

app.post('/api/exercise/new-user', (req, res, next)=> {
  Users.create({username:req.body.username})
    .then((user) => {
        // console.log('User Created!', user)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
    }, (err) => next(err))
    .catch((err) => next(err))
})

app.get('/api/exercise/log', (req, res, next)=> {
  var id = req.param.id
  var from = req.param.from
  var to = req.param.to
  var limit = req.param.limit
  Users.findById(req.body.userId)
    .then((user) => {
      if(user != null){
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(user)
      } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end('Unknown Id')        
      }
  })
    .catch((err) => next(err))
  
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})