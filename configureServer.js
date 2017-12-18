// server
const path = require("path");
const logger = require("morgan");
const port = 3000;
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io", {
	rememberTransport: false,
	transports: ["WebSocket", "Flash Socket", "AJAX long-polling"],
})(server);
const basicAuth = require("basic-auth");
const cookieParser = require("socket.io-cookie-parser");
const expCookieParser = require("cookie-parser");
const reconToken = "fingerpainting_refresh_token";
const formidable = require("formidable");
const util = require("util");
const url = require("url");
const Mailer = require("./server/classes/Mailer");
let mailer = new Mailer();

io.use(cookieParser());
app.use(expCookieParser());

// configure server
server.listen(port);

var auth = function(req, res, next) {
	function unauthorized(res) {
		res.set("WWW-Authenticate", "Basic realm=Authorization Required");
		return res.sendStatus(401);
	}

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	}

	if (user.name === "admin" && user.pass === "chuckberry") {
		return next();
	} else {
		return unauthorized(res);
	}
};

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/rooms/*", (req, res) => {
	let pathString = url.parse(req.url).path;
	let index = pathString.indexOf("rooms");
	let roomId = pathString.substring(index + 6, pathString.length);
	res.redirect("/joining?room=" + roomId);
});

app.get("/joining*", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/admin", auth, (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/contact", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/contact", function(req, res) {
	processFormFieldsIndividual(req, res);
});

app.get("/success", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/", function(req, res) {
	let cookie = getCookie(req, reconToken);

	if (!cookie) {
		// no: set a new cookie
		let timestamp = new Date().getTime();
		let random = Math.random().toString();

		res.cookie(reconToken, timestamp, { maxAge: 900000, httpOnly: true });
	}

	res.sendFile(__dirname + "/views/index.html");
});

function processAllFieldsOfTheForm(req, res) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		//Store the data from the fields in your data store.
		//The data store could be a file or database or any other store based
		//on your application.
		res.writeHead(200, {
			"content-type": "text/plain",
		});
		res.write("received the data:\n\n");
		res.end(
			util.inspect({
				fields: fields,
				files: files,
			}),
		);
	});
}

function processFormFieldsIndividual(req, res) {
	//Store the data from the fields in your data store.
	//The data store could be a file or database or any other store based
	//on your application.
	var fields = [];
	var form = new formidable.IncomingForm();

	form.on("field", function(field, value) {
		fields[field] = value;
	});

	form.on("end", function() {
		res.redirect("/success");
		mailer.send(fields.email, fields.name, fields.message);
	});

	form.parse(req);
}

function getCookie(req, name) {
	let cookie = req.cookies[name];

	return cookie;
}

module.exports = {
	io: io,
};
