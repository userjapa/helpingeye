const express    = require('express'),
      bodyParser = require('body-parser'),
      cors       = require('cors'),
      https      = require('https'),
      http       = require('http'),
      fs         = require('fs')

const routes = require('./routes')

const PORT1 = process.env.PORT1 || 8080,
      PORT2 = process.env.PORT2 || 8081

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
  passphrase: 'opensource',
  requestCert: false,
  rejectUnauthorized: false
}

routes(app)

https.createServer(options, app)
     .listen(PORT1, () => console.log(`Running at port ${PORT1}`))

http.createServer(app)
    .listen(PORT2, () => console.log(`Running at port ${PORT2}`))
