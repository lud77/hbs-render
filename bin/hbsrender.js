#!/usr/bin/env node

"use strict";

const options = require("commander");
const hbs = require("handlebars");
const fs = require("fs");
const packageJson = require('../package.json');

/**
 * Populate the list of partials passed with the -p CLI option
 */
function collectPartials(val, memo) {
	let parts = val.split(':');
	if (parts.length === 2) {
		memo.names.push(parts[0]);
		memo.files.push(parts[1]);
	} else {
		console.log('invalid format for parameter "-p ' + val + '" please specify [partial_name]:[path/to/file.hbs]');
	}
}

/**
 * Load the partials if they exist
 */
function loadPartials(partials, callback, ndx) {
	let i = ndx || 0;
	if (partials.files[i] !== undefined) {
		fs.readFile(partials.files[i], function(err, buffer) {
			if (err) {
				partials.contents.push(false);
			} else {
				partials.contents.push(buffer.toString('utf8'));
			}

			loadPartials(partials, callback, i + 1);
		});
	} else {
		setImmediate(callback);
	}
}

/**
 * Register the partials and render the template in the specified context
 */		 
function render(template, partials, context) {
	partials.contents.map((content, n) => {
		if (content && partials.names[n]) hbs.registerPartial(partials.names[n], content);
	});

	var res = hbs.compile(template)(context);
	console.log(res);
}

let partials = {
	names: [],
	files: [],
	contents: []
};

options
	.version(packageJson.version)
	.option('-t, --template <template>', 'tempate to render')
	.option('-p, --partial <partial>', 'partial to make available to the template', collectPartials, partials)
	.option('-c, --context <context>', 'JSON file with data to be made available to the template')
	.parse(process.argv);

// Load the template file, the context file and the partials, then launch rendering
if (options.template !== undefined) {
	fs.readFile(options.template, function(err, buffer) {
		let template = buffer.toString('utf8');
		loadPartials(partials, function() {
			if (options.context !== undefined) {
				fs.readFile(options.context, function(err, buffer) {
					let context = JSON.parse(buffer.toString('utf8'));
					render(template, partials, context);
				});
			} else {
				render(template, partials, {});
			}
		});
	});
}
