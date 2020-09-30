require('dotenv').config()

const express    = require('express'),
      bodyParser = require('body-parser'),
      cors       = require('cors'),
      https      = require('https'),
      http       = require('http'),
      fs         = require('fs')

const routes = require('./routes')

const PORT     = process.env.NODE_ENV == 'production' ? process.env.PORT : process.env.DEV_PORT,
      PORT_SSL = process.env.NODE_ENV == 'production' ? process.env.PORT_SSL : process.env.DEV_PORT_SSL

const app = express()

app.use(express.static('public'))
app.use(bodyParser.json({ limit: '150mb' }))
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }))
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}))

const options = {
  key: fs.readFileSync('./cert/key.pem', 'utf8'),
  cert: fs.readFileSync('./cert/cert.pem', 'utf8'),
  passphrase: process.env.PASSPHRASE,
  requestCert: false,
  rejectUnauthorized: false
}

routes(app)

https.createServer(options, app)
     .listen(PORT_SSL, () => console.log(`Running at port ${PORT_SSL}`))

http.createServer(app)
    .listen(PORT, () => console.log(`Running at port ${PORT}`))
