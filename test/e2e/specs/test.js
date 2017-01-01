// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.MainView')
      .assert.elementPresent('.SettingsView')
      .assert.elementCount('button', 4) // "Reset", "Start/Pause", "Settings", "Back" Button
      .assert.elementCount('img', 1) // "Pomodori" Logo
      .end()
  }
}
