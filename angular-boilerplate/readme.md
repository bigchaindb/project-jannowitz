# Angular 6 app template for BigchainDB apps

This is a simple angular app demonstrating how we structure BigchainDB client apps using Angular 6.

![screen-shot](./ScreenShot.png)

## Structure

The app has the following structure within the default Angular app structure,

![app-structure](./Structure.png)

The app folder has the following sub-folder for organizing code,

1. **dashboard** Master component and it can further have child components under it
2. **models** For data models
3. **shared** For shared services for BigchainDB connection, authentication, configuration
4. **business** For use case related services - user management, asset management

> There can be other sub-folders on need basis.

## Deployment

There is sample docker file in the root which can be referred for docker deployment of the app.