require('dotenv').config()
const app = require('./app')
const DBconnection = require('./config/dbConnection')

const start = async () => {
	try {
		await DBconnection()
		console.log('DB connected 🚀')
		app.listen(process.env.PORT, () =>
			console.log(`Server is listening on port ${process.env.PORT}...`)
		)
	} catch (error) {
		console.log(`${error.name}:${error.message}`)
		console.log(error)
		process.exit(1)
	}
}
start().then(() =>console.log('app started'))
