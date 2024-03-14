const Coupon = require('../models/coupons')
const factory = require('./factoryHandler')

exports.getAllCoupons = factory.getAll(Coupon)
exports.getCoupon = factory.getOne(Coupon)
exports.createCoupon = factory.createOne(Coupon)
exports.updateCoupon = factory.updateOne(Coupon)
exports.deleteCoupon = factory.deleteOne(Coupon)
