var fs = require("fs");
var path = require('path');
var Handlebars = require("handlebars");

Handlebars.registerHelper('cleanUrl', function(url) {
	let newUrl = url;

	if (url.search("^http\:\/\/") != -1) {
  	newUrl = url.slice(7);
	} else if (url.search("^https\:\/\/") != -1) {
		newUrl = url.slice(8);
	}

	if (newUrl.charAt(newUrl.length - 1) === "/") {
		newUrl = newUrl.slice(0, newUrl.length - 1);
	}

	return newUrl;
});

Handlebars.registerHelper('lowercase', function(text) {
	return text.toLowerCase();
});

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	var partialsDir = path.join(__dirname, 'partials');
	var filenames = fs.readdirSync(partialsDir);

	filenames.forEach(function (filename) {
	  var matches = /^([^.]+).hbs$/.exec(filename);
	  if (!matches) {
	    return;
	  }
	  var name = matches[1];
	  var filepath = path.join(partialsDir, filename)
	  var template = fs.readFileSync(filepath, 'utf8');

	  Handlebars.registerPartial(name, template);
	});
	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
