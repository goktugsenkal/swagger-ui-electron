const { join } = require("path");
const { getAbsoluteFSPath } = require("swagger-ui-dist");
const { app, BrowserWindow } = require("electron");
const debug = require("debug")("swagger-ui-electron");

const swaggerUiIndex = join(getAbsoluteFSPath(), "index.html");
debug(`Serving Swagger UI from ${swaggerUiIndex}`);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile(swaggerUiIndex);
};

app.whenReady().then(() => {
  debug("Creating Window");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
