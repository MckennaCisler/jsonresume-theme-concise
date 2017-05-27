# Concise JSON Resume theme
<!-- [![](https://badge.fury.io/js/jsonresume-theme-concise.svg)](https://www.npmjs.org/package/jsonresume-theme-concise) -->
This is a theme for [JSON Resume](http://jsonresume.org/).

JSON Resume is a schema for encoding resume details in a JSON file. Themes like this one then parse that file and generate a nice HTML resume from it.

## Installation
<!-- ### Using the theme server
The simplest way to use this theme is to simply call it up from JSON Resume's theme server:

```
resume serve --theme concise
``` -->

### Install the command line

You'll need JSON Resume's official [resume-cli](https://github.com/jsonresume/resume-cli) to serve a `resume.json` using this theme.

To install it:

```
sudo npm install -g resume-cli
```

### Install dependencies
```bash
sudo npm install
```

### Serve theme

Inside the root folder, run this to generate and serve the theme HTML using `resume.json`:

```
resume serve
```

You'll want to replace the default `resume.json` with your own.

## Details on working with this theme.

## License

Available under [the MIT license](http://mths.be/mit).
