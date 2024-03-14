class Api {
	constructor(query, reqQuery) {
		this.query = query
		this.reqQuery = reqQuery
	}

	filtering() {
		const queryObj = { ...this.reqQuery }
		const exclude = ['page', 'limit', 'sort', 'fields', 'search']
		exclude.forEach((ele) => delete queryObj[ele])
		let advQueryObj = JSON.stringify(queryObj)
		advQueryObj = advQueryObj.replace(
			/\b(gt|gte|lt|lte)\b/g,
			(match) => `$${match}`
		)
		this.query.find(JSON.parse(advQueryObj))
		// console.log(JSON.parse(advQueryObj))
		return this
	}

	sort() {
		if (this.reqQuery.sort) {
			const sortingObj = this.reqQuery.sort.split(',').join(' ')
			this.query.sort(sortingObj)
		} else this.query.sort('-createdAt')
		return this
	}

	projection() {
		if (this.reqQuery.fields) {
			const fieldsObj = this.reqQuery.fields.split(',').join(' ')
			this.query.select(fieldsObj)
		} else this.query.select('-__v')
		return this
	}

	pagination(count) {
		const page = this.reqQuery.page * 1 || 1
		const limit = this.reqQuery.limit * 1 || 5
		const skip = (page - 1) * limit
		this.query.skip(skip).limit(limit)

		const pagingObj = {}
		pagingObj.limit = limit
		pagingObj.noPages = Math.ceil(count / limit)
		pagingObj.currentPage = page
		const endIndex = page * limit
		if (endIndex < count) pagingObj.nextPage = page + 1
		if (pagingObj.currentPage > 1)
			pagingObj.prevPage = pagingObj.currentPage - 1

		this.paginationFeatures = pagingObj
		return this
	}

	search() {
		if (this.reqQuery.search) {
			console.log(this.reqQuery.search)
			this.query.find({
				$or: [
					{ title: { $regex: this.reqQuery.search, $options: 'i' } },
					{ name: { $regex: this.reqQuery.search, $options: 'i' } },
					{ description: { $regex: this.reqQuery.search, $options: 'i' } },
				],
			})
		}
		return this
	}
}
module.exports = Api
