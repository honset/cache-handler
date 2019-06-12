# Getting Started With Cache Handler
Library that will take care of cache handling for any rich enterprise application. The purpose of this library is to forcefully treat a new deployment of a web application as if it were the first time that the user has ever visited the site. The overall goal is to have as few steps as possible to reload everything.
All the forced refresh/cache clearing stuff should happen only 1 time for any given application deployment. And this needs to be reloaded on user confirmation even if the user is in the middle of doing something as the application is a single page rich application.
The user should not continually experience this behaviour on a periodic basis. Only when a new version of the application

### Service worker introduction
At its simplest, a service worker is a script that runs in the web browser and manages caching for an application.
Service workers function as a network proxy. They intercept all outgoing HTTP requests made by the application and can choose how to respond to them. For example, they can query a local cache and deliver a cached response if one is available. Proxying isn't limited to requests made through programmatic APIs, such as fetch; it also includes resources referenced in HTML and even the initial request to index.html. Service worker-based caching is thus completely programmable and doesn't rely on server-specified caching headers.
The Service worker's behaviour follows that design goal:
•	Caching an application is like installing a native application. The application is cached as one unit, and all files update together.
•	A running application continues to run with the same version of all files. It does not suddenly start receiving cached files from a newer version, which are likely incompatible.
•	When users refresh the application, they see the latest fully cached version. New tabs load the latest cached code.
•	Updates happen in the background, relatively quickly after changes are published. The previous version of the application is served until an update is installed and ready.
•	The service worker conserves bandwidth when possible. Resources are only downloaded if they've changed.
To support these behaviours, the Angular service worker loads a manifest file (ngsw-config.json) from the server. The manifest describes the resources to cache and includes hashes of every file's contents. When an update to the application is deployed, the contents of the manifest change, informing the service worker that a new version of the application should be downloaded and cached.

### Adding a service worker to your project
To set up the Service worker in your project, use the CLI command ng add @angular/pwa. It takes care of configuring your app to use service workers by adding the service-worker package along with setting up the necessary support files.
ng add cache-handler --project *project-name*

Now, build the project:
ng build --prod

To serve the directory containing your web files with http-server, run the following command
http-server -p 8080 -c-1 dist/<project-name> 

### Initial load
With the server running, you can point your browser at http://localhost:8080/. Your application should load normally.

### What's being cached?
Notice that all of the files the browser needs to render this application are cached. The ngsw-config.json boilerplate configuration is set up to cache the specific resources:
•	index.html.
•	favicon.ico.
•	Build artifacts (JS and CSS bundles).
•	Anything under assets.
•	Images and fonts directly under the configured outputPath (by default ./dist/<project-name>/) 
You can modify the default configuration to your need and add Rest API URLs as well.
### Available and activated updates
Export Class CacheService {
……………..
updates.available.subscribe(event => { console.log('current version is', event.current); console.log('available version is', event.available); }); updates.activated.subscribe(event => { console.log('old version was', event.previous); console.log('new version is', event.current); });
………………
}
### Checking for updates
Export Class CacheService {
……………..
const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true)); const everySixHours$ = interval(6 * 60 * 60 * 1000); const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$); everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
………………
}
### Forcing update activation
Export Class CacheService {
……………..
updates.available.subscribe(event => { if (promptUser(event)) { updates.activateUpdate().then(() => document.location.reload()); } });
………………
}













