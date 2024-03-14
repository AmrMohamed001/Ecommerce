const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
///////////////////////////////////////////

module.exports = class Email {
	constructor(user, code) {
		this.to = user.email
		this.from = 'admin@Eshop.io'
		this.code = code
		this.firstName = user.name.split(' ')[0]
	}

	transporter() {
		if (process.env.NODE_ENV === 'development') {
			// sendGrip
			return nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: 'amrmoha960@gmail.com',
					pass: 'sdge hwwj ohwg mkln',
				},
			})
		}
		return nodemailer.createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 587,
			auth: {
				user: '49595a5de3921f',
				pass: '4c9e0642fa6a44',
			},
		})
	}

	async send(templete, subject) {
		// 1) Render html based on pug templete
		const html = pug.renderFile(`${__dirname}/../views/mails/${templete}.pug`, {
			firstName: this.firstName,
			code: this.code,
			subject,
		})
		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text: htmlToText.htmlToText(html),
			html,
		}
		// 3) create transport and send email
		await this.transporter().sendMail(mailOptions)
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to Eshop family 👍')
	}

	async sendResetPassword() {
		await this.send(
			'passwordReset',
			'Your password reset pin code (Valid for 10 min)'
		)
	}
}
