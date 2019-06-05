# Getting Started With Schematics

This repository is a basic Schematic implementation to serve cache handling of your application. The purpose of this library is to forcefully treat a new deployment of a web application as if it were the first time that the user has ever visited the site. The overall goal is to have as few steps as possible to reload everything.  

All the forced refresh/cache clearing stuff should happen only 1 time for any given application deployment.
And this needs to be reloaded on user confirmation even if the user is in the middle of doing something as the application is a single page rich application. 

The user should not continually experience this behavior on a periodic basis. Only when a new version of the application

**Prerequisites:** [Node.js 10](https://nodejs.org).

* [Getting Started](#getting-started)
* [Links](#links)

## Getting Started

Clone this application to your local hard drive using Git.

```
git clone https://github.com/cache-handler.git
cd cache-handler
npm i
```

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`.\node_modules\.bin\jasmine src/**/*_spec.js` will run the unit tests, using Jasmine as a runner and test framework.


## Links

This example uses the following open source libraries:

* [Schematics](https://www.npmjs.com/package/cache-handler)

