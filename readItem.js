const { BrowserWindow } = require('electron');

// Offscreen BrowserWindow
let offscreenWindow

module.exports = (url, callback) => {
  // Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500, height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    }
  });

  // Load item url
  offscreenWindow.loadURL(url);

  // Wait for content to finish load
  offscreenWindow.webContents.on('did-finish-load', () => {
    // Get page title
    let title = offscreenWindow.getTitle();
    // Get thumbnail
    offscreenWindow.webContents.capturePage()
      .then(image => {
        // Get image as data url
        let screenshot = image.toDataURL();

        // Execute callback with new item object
        callback({title, screenshot, url});

        // Clean up
        offscreenWindow.close();
        offscreenWindow = null;
      })
  })
}