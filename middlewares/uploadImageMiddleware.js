const multer = require('multer')
const AppError = require('../utils/AppError')

const multerOptions = () => {
	const multerStorage = multer.memoryStorage()
	const multerFilter = (req, file, cb) => {
		if (file.mimetype.startsWith('image')) cb(null, true)
		else cb(new AppError(400, 'only images is accepted'), false)
	}
	return multer({ storage: multerStorage, fileFilter: multerFilter })
}
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName)

exports.uploadMix = (mixFields) => multerOptions().fields(mixFields)
