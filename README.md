# HbsRender v1.0.9
> A CLI tool to render Handlebars templates with partials


## Installation

	npm i hbsrender


## Why?

The standard Handlebars CLI interface doesn't allow you to include sub-templates (template parts) in templates to be rendered on the server.


# Features

This module has a single purpose: to provide a CLI interface to render Handlebars templates server-side. It does that by giving you parameters to specify paths to template parts and to a JSON file containing the context.

Note: the output of this tool is not a compiled Handlebars template. The template is compiled in-memory and immediately used with the context data to generate a render.


## Usage

./node_modules/.bin/hbsrender [options]

Options:

	-h, --help                 output usage information
	-V, --version              output the version number
	-t, --template <template>  tempate to render
	-p, --partial <partial>    partial to make available to the template
	-c, --context <context>    JSON file with data to be made available to the template

You can use any number of "-p" parameters to specify as many template parts as you need.
The value of the "-p" parameter <partial> must be specified in the format *partial-name:path-to-file*.


## Example

	npx hbsrender -t main_template.hbs -c ./context.json -p part1:parts/part1.hbs -p part2:parts/part2.hbs


This will render the main_template.hbs to standard output, pulling variables for the rendering from context.json.

To render to a file you can do:

	npx hbsrender [options] > output.html


In this example, inside main_template.hbs you can refer to the partials "part1" and "part2" respectively using {{#> part1}} and {{#> part2}}.

You can also provide default replacementes for a partial (should it be not provided on the command line) using the following snippet:

	{{#> part1}}
		
		...fallback content here...
	
	{{/part1}}


## Licensing

This package is released under the [MIT License](https://opensource.org/licenses/MIT)
