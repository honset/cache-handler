# Getting Started With Schematics

Library that will take care of cache handling for any rich enterprise application The purpose of this library is to forcefully treat a new deployment of a web application as if it were the first time that the user has ever visited the site. The overall goal is to have as few steps as possible to reload everything.  

All the forced refresh/cache clearing stuff should happen only 1 time for any given application deployment.
And this needs to be reloaded on user confirmation even if the user is in the middle of doing something as the application is a single page rich application. 

The user should not continually experience this behavior on a periodic basis. Only when a new version of the application

### Command
ng add cache-handler --project project-name

this will install all necessary dependencies and make the required changes in your application to do cache handling. 

Preferbly, latest version of angular cli and angular core.


 