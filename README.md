# Swagger UI Electron

Small electron wrapper around the Swagger UI Dist package to serve it locally.

This uses the latest `swagger-ui-dist` as published by the Swagger Team, so it should always be up-to-date.

Just re-run the installation steps to update for any new releases.

## Installation

The project must be built from source, so requires NodeJS to be installed.

The npm build script handles the work

```shell
$ npm run build
```

Copy the system compatible executable from the `out` folder to your desired install location.

### OSX

Example to copy an Arm Mac Bundle 

```shell
$ cp -R ./out/swagger-ui-electron-darwin-arm64/swagger-ui-electron.app ~/Applications
```

### Windows

On Windows you can run the Squirrel Installer located in `out/make/squirrel.windows/x64/swagger-ui-election-X.X.X Setup.exe` 
which installs to the AppData folder location `%LOCALAPPDATA%\SwaggerUi` which can be then pinned to start as required.

See https://www.electronforge.io/config/makers/squirrel.windows

Or just copy the built app to Program Files etc as required from `out/swagger-ui-electron-win32-x64`

## Usage

By default, it loads the example petstore swagger spec, change the URL to point to the desired API 
spec and press explore to load it.

![img.png](img.png)

## Built With

- https://www.electronjs.org/
- https://www.npmjs.com/package/swagger-ui-dist