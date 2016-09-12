// fingerpainting.io.server@gmail.com
const nodemailer = require('nodemailer');

const settings = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'fingerpainting.io.server@gmail.com',
		pass: 'rsLeo139742685'
	}
}


class Mailer {
	constructor() {
		this.transporter = nodemailer.createTransport('smtps://fingerpainting.io.server%40gmail.com:rsLeo139742685@smtp.gmail.com');
	}

	send(emailAddress,userName,message) {
		this.mailOptions = {
			from: `"${userName}: ${emailAddress}" <${emailAddress}>`, // sender address
			to: 'fingerpainting.io@gmail.com', // list of receivers
			subject: 'Contact form', // Subject line
			text: message, // plaintext body
			html: `<p>${message}</p>` // html body
		}

		this.transporter.sendMail(this.mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	}
}

module.exports = Mailer;

