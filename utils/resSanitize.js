exports.sanitizeUserLogging = function (user) {
	return {
		id: user._id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		image: user.image,
		slug: user.slug,
	}
}
