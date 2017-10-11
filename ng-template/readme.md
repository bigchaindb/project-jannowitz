# Angular 4 app template for BigchainDB apps

![screen-shot](https://github.com/ascribe/project-jannowitz/blob/master/ng-template/Screen%20Shot.png)

This is a simple angular app demonstrating how we structure BigchainDB client apps using Angular 4.

## Structure
The app has the following structure within the default Angular app structure,

![app-structure](https://github.com/ascribe/project-jannowitz/blob/master/ng-template/Structure.png)

The app folder has the following sub-folder for organizing code,
1. **dashboard** Master component and it can further have child components under it
2. **models** For data models
3. **shared** For shared services for BigchainDB connection, authentication, configuration
4. **business** For use case related services - user management, asset management

> There can be other sub-folders on need basis.

## RBAC

[RBAC](https://github.com/ascribe/project-jannowitz/blob/master/rbac/rbac.md) can be supported on this app by following the code in bootstrap/init.js.
The code in this file does the following steps,
1. Creates the initial users
2. Creates the app, types and instances for users and other assets
3. Emits a config json which needs to be pasted (overwrite) in the assets/app.config.json

> This is a one time activity. Comment out the init.js call after first run.

After this, the business services can be built on top of the app and type assets in the config file. See reference implementation in [RTA PoC code](https://github.com/ascribe/vehicle-registry/tree/master/src/client).

## Deployment

There is sample docker file in the root which can be referred for docker deployment of the app.


