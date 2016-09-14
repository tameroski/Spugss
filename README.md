# Spugss

## Requirements

Ruby, Sass & Grunt

## Installation

Clone repository and run `npm install` to install dependencies.

To run the main task : `grunt`

This will compile Sass files, Pug files, minify css & JS, etc.

## Configuration

Spugss is using livereload. Update the project's Gruntfile.js `siteURL` variable for your site to automatically reload when a change is done to either a js, sass or pug file.

### Pug

Pug sources files are located in `sources/` and `sources/includes/`

### Sass

Sass files are located in `assets/styles` and uses [Bourbon](https://github.com/thoughtbot/bourbon), [Neat](https://github.com/thoughtbot/neat) & [Bitters](https://github.com/thoughtbot/bitters)

You can add stylesheets files directly to the `assets/styles/libs/` directory. They will be automatically added to your app's css file, minified.

### Javascript

JS files are located in `assets/scripts`.

You can add libraries of your choice directly to the `assets/scripts/libs/` directory. They will be automatically added to your app's script file, minified.

### Destination

Destination files are automatically  generated in `build/` 

Enjoy!