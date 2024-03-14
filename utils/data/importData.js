const fs = require('fs')
require('colors')

const dotenv = require('dotenv')
const Product = require('../../models/product')
const dbConnection = require('../../config/dbConnection')

dotenv.config({ path: '../.env' })
// eslint-disable-next-line no-unused-vars
dbConnection().then(() => console.log('db connected'))
// Read data
const products = JSON.parse(fs.readFileSync('./dummyData.json'))

// Insert data into DB
const insertData = async () => {
	try {
		await Product.create(products)

		process.exit()
	} catch (error) {
		console.log(error)
	}
}

// Delete data from DB
const destroyData = async () => {
	try {
		await Product.deleteMany()

		process.exit()
	} catch (error) {
		console.log(error)
	}
}

// node seeder.js -d
if (process.argv[2] === '-i') {
	insertData().then(() => console.log('Data Inserted'.green.inverse))
} else if (process.argv[2] === '-d') {
	destroyData().then(() => console.log('Data Destroyed'.red.inverse))
}
