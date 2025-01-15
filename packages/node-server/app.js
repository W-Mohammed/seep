const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const { env } = require('process')
const { initializeDb } = require('./scripts/initialize-db');
require('dotenv').config()

// check if all required environment variables are set
const requiredEnvVars = ['NODE_ENV','DB_URL', 'R_SERVER_HOST', 'CLIENT_HOST']
requiredEnvVars.forEach((envVar) => {
  if (!env[envVar]) {
    console.error(`Environment variable ${envVar} is missing`)
    process.exit(1)
  }
})

const { morganLogger } = require('./services/logging')
const { limiter } = require('./services/rateLimit')
const { login } = require('./routes/login')
const { rootApi } = require('./routes/root')
const { surveysApi } = require('./routes/surveysApi')
const { expertsApi } = require('./routes/expertsApi')
const { tenantsApi } = require('./routes/tenantsApi')
const { usersApi } = require('./routes/usersApi')
const { responsesApi } = require('./routes/responsesApi')
const { analyticsApi } = require('./routes/analyticsApi')
const { otherServicesApi } = require('./routes/otherServicesApi')


mongoose.connect(env.DB_URL, {
  autoIndex: true, // env.NODE_ENV !== "production",
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => console.log('MongoDB connected'))

const port = env.PORT || 3000
const app = express()
app.use(express.json({ limit: '20mb' }))
app.use(express.static('public'))
app.use(cors())
app.use(morganLogger)
app.use(helmet())
app.use(limiter)

login(app)
rootApi(app)
surveysApi(app)
expertsApi(app)
tenantsApi(app)
usersApi(app)
responsesApi(app)
analyticsApi(app)
otherServicesApi(app)

initializeDb();

console.log("ENVIRONMENT: ", env.NODE_ENV)
console.log("LISTENING TO: ", port)
console.log("DB_URL: ", env.DB_URL)
console.log("R_SERVER_HOST: ", env.R_SERVER_HOST)
console.log("CLIENT_HOST: ", env.CLIENT_HOST)

app.listen(port)
