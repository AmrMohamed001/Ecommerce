const slugify = require('slugify')
const SubCategory = require('../models/subCategory')
const factory = require('./factoryHandler')

exports.slugSub = (req, res, next) => {
	if (req.body.name) req.body.slug = slugify(req.body.name)
	next()
}
exports.createFilterObj = (req, res, next) => {
	let filterObj = {}
	if (req.params.categoryId) filterObj = { category: req.params.categoryId }
	req.filterObj = filterObj
	next()
}
exports.setCategoryId = (req, res, next) => {
	if (req.params.categoryId) req.body.category = req.params.categoryId
	next()
}

exports.getAllSubs = factory.getAll(SubCategory)
exports.getSub = factory.getOne(SubCategory)
exports.createSub = factory.createOne(SubCategory)
exports.updateSub = factory.updateOne(SubCategory)
exports.deleteSub = factory.deleteOne(SubCategory)
