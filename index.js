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
		case "hardware": return "fa-cogs"
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
	let yrs = duration.getFullYear() - 1970;
	let months = duration.getMonth();
	let days = duration.getDate();

	if (yrs < 0) {
		return "0 days";
	} else if (yrs == 0) {
		if (months <= 0) {
			if (days == 0) {
				days = 1;
			}
			return days + " day" + (days == 1 ? "" : "s");
		} else {
			if (days >= 14) {
				months++;
			}
			return months + " month" + (months == 1 ? "" : "s");
		}
	} else {
		if (months >= 6) {
			yrs++;
		}
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
	return `${dateInfo[1]} ${Number(dateInfo[2])+1} ${dateInfo[3]}`; // fixing bug with off-by-one day of month...
});

function render(resume) {
	var normalizeCss = "";
	try {
		normalizeCss = fs.readFileSync(__dirname + "/node_modules/normalize.css/normalize.css", "utf-8");
	} catch (err) {
		console.log("WARNING: Normalize.css is not installed. Have you run 'npm install'?");
	}

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
		normalizeCss: normalizeCss,
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
