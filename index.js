'use strict';

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

Handlebars.registerHelper('projectTypeIcon', function(type) {
	switch (type.toLowerCase()) {
		case "volunteering": return "fa-life-bouy"
		case "presentation": return "fa-pie-chart"
		case "talk": return "fa-signing"
		case "application": return "fa-code"
		case "conference": return "fa-building"
	}
});

Handlebars.registerHelper('absoluteUrl', function(url) {
	if (url.search("^http\:\/\/") != -1) {
  	return url;
	} else if (url.search("^https\:\/\/") != -1) {
		return url;
	} else {
		return "http://" + url;
	}
});

Handlebars.registerHelper('durationOf', function(date) {
	// now if undefined
	let endDate = new Date()
	if (date.endDate != undefined) {
		endDate = new Date(date.endDate);
	}

	// treat the MS difference as off the epoch and get deltas from that
	const duration = new Date(endDate - new Date(date.startDate));
	const yrs = duration.getFullYear() - 1970;

	if (yrs <= 0) {
		const months = duration.getMonth();

		if (months <= 0) {
			let days = duration.getDate()
			return days + " day" + (days == 1 ? "" : "s");
		} else {
			return months + " month" + (months == 1 ? "" : "s");
		}
	} else {
		return yrs + " year" + (yrs == 1 ? "" : "s");
	}
});

Handlebars.registerHelper('shortDate', function(date) {
	let dateObj = new Date(date);
	let month = dateObj.toDateString().split(" ")[1];
	return month + " " + dateObj.getFullYear();
});

Handlebars.registerHelper('niceDate', function(date) {
	// ex. Mon May 12 2017
	let dateInfo = new Date(date).toDateString().split(" ");
	return `${dateInfo[1]} ${dateInfo[2]} ${dateInfo[3]}`;
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
