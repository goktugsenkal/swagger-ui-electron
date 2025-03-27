const { app, BrowserWindow, ipcMain, screen } = require("electron");
const { join } = require("path");
const fs = require("fs");
const os = require("os");

const createMainWindow = () => {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const widthRatio = 0.85;
  const heightRatio = 0.85;

  const winWidth = Math.floor(screenWidth * widthRatio);
  const winHeight = Math.floor(screenHeight * heightRatio);
  
  const mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("main.html");
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-swagger-files", async () => {
  const downloadsPath = join(os.homedir(), "Downloads");
  let files = await fs.promises.readdir(downloadsPath);
  files = files.filter(file => file.includes(".json"));
  
  const fileStats = await Promise.all(
    files.map(async file => {
      const filePath = join(downloadsPath, file);
      const stats = await fs.promises.stat(filePath);
      let info = null;
      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        const json = JSON.parse(data);
        if (json.info) {
          info = json.info;
        }
      } catch (err) {
        console.error(`Failed to parse ${file}:`, err);
      }
      return {
        name: file,
        path: filePath,
        birthtime: stats.birthtime,
        info,
      };
    })
  );
  
  fileStats.sort((a, b) => b.birthtime - a.birthtime);
  return fileStats;
});

