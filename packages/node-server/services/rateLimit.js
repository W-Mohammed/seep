const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	limit: 250, // Limit each IP to 200 requests per windowMs
	standardHeaders: 'draft-7', 
	legacyHeaders: false
})


module.exports = { limiter }