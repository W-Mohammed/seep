const morgan = require('morgan')
const winston = require('winston')
require('winston-daily-rotate-file')

morgan.token('code', function getCode(req) {
  if (req.body?.password) req.body.password = '****'
  if (req.body?.newPassword) req.body.newPassword = '****'
  if (req.body?.currentPassword) req.body.currentPassword = '****'
  // if body.agenda exists, truncate it
  if (req.body?.agenda) {
    req.body.agenda = 'Agenda has ' + req.body.agenda.length + ' items'
  }
  // if length of body is greater than 1000, truncate it
  if (JSON.stringify(req.body)?.length > 500) {
    return JSON.stringify(req.body).slice(0, 500) + '... (truncated)'
  }

  return JSON.stringify(req.body)
})

const transportInfo = new winston.transports.DailyRotateFile({
  dirname: '../../logs/server/',
  level: 'info',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
})

const transportVerbose = new winston.transports.DailyRotateFile({
  dirname: '../../logs/server/',
  level: 'verbose',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
})

const transportError = new winston.transports.DailyRotateFile({
  dirname: '../../logs/server/',
  level: 'error',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
})

const transportConsole = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
})

const prodTransports = [transportInfo]
const devTransports = [transportConsole, transportVerbose]

const logger = winston.createLogger({
  level: 'info',
  transports: process.env.NODE_ENV === 'production' ? prodTransports : devTransports,
  exceptionHandlers:
    process.env.NODE_ENV === 'production' ? [transportError] : [transportConsole],
})

logger.stream = {
  write: function (message) {
    logger.log({
      level: 'info',
      message: message,
    })
  },
}

const morganLogger = morgan(
  ':date[iso] :method :url :status :res[content-length] - :response-time ms',
  { stream: logger.stream }
)

module.exports = { morganLogger }
