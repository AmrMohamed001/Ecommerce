const { check } = require('express-validator')
const Category = require('../../models/category')
const validator = require('./validator')

exports.validateGetUpDelCategory = [
	check('id').isMongoId().notEmpty().withMessage('this is not valid id'),
	validator,
]

exports.validateAddCategory = [
	check('name')
		.notEmpty()
		.withMessage('you should enter category name')
		.custom((value) => Category.findOne({ where: { name: value } }).then(() => Promise.reject('Name already taken')))
		.withMessage('this name exists'),
	validator,
]
