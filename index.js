const express    = require('express'),
      bodyParser = require('body-parser'),
      cors       = require('cors'),
      https      = require('https'),
      fs         = require('fs')

const routes = require('./routes')

const PORT = process.env.PORT || 8080

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
     .listen(PORT, () => console.log(`Running at port ${PORT}`))
