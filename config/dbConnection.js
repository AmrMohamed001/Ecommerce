const mongoose = require('mongoose')

const connection = function () {
	return mongoose.connect(process.env.DB)
}
module.exports = connection
