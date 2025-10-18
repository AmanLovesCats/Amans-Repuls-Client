const path = require('path');
module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'assets/icons/faviconV2')  // no extension
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: path.resolve(__dirname, 'assets/icons/faviconV2.ico')
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.resolve(__dirname, 'assets/icons/faviconV2.icns')
      }
    },
    {
      name: '@electron-forge/maker-zip'
    }
  ]
};
