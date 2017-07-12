<p align="center">
  <a href="https://pomodori-pwa.firebaseapp.com/" target="_blank"><img src="https://github.com/tohjustin/pomodori/blob/master/static/img/icons/icon-192x192.png"></a>
  <br>
  <a href="https://pomodori-pwa.firebaseapp.com/" target="_blank"><img height="50" src="https://github.com/tohjustin/pomodori/blob/master/static/img/logo.png"></a>
</p>
<p align="center">
  <a href="https://circleci.com/gh/tohjustin/pomodori/tree/master"><img src="https://circleci.com/gh/tohjustin/pomodori/tree/master.svg?style=shield" alt="CircleCI Build Status"/></a>
  <a href="https://github.com/tohjustin/pomodori/releases"><img src="https://img.shields.io/github/release/tohjustin/pomodori.svg" alt="Release Version"/></a>
  <a href="https://codecov.io/gh/tohjustin/pomodori"><img src="https://codecov.io/gh/tohjustin/pomodori/branch/master/graph/badge.svg" alt="Codecov" /></a>
  <a href="https://www.codacy.com/app/tohjustin/pomodori?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tohjustin/pomodori&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/ab08c87aa6a3467496591b87ad77f8e8"/></a>
  <a href="https://pomodori-pwa.firebaseapp.com/lighthouseReport.html"><img src="https://img.shields.io/badge/lighthouse-100%2F100-ff69b4.svg"/></a>
  <a href="https://github.com/tohjustin/pomodori/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"/></a>
</p>
<p align="center">
  <span>
    Material-design flavoured pomodoro timer built as a Progressive Web App
  </span>
  <br>
  <span>
    Powered by <a href="https://vuejs.org/">Vue 2.0</a> + <a href="https://museui.github.io/">Muse-UI</a>
  </span>
</p>

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [NPM](https://docs.npmjs.com/getting-started/installing-node) + [Yarn](https://yarnpkg.com/en/docs/install#mac-tab)

**(Optional)** If you want to test the build files locally (via `yarn run serve`):
- [Python](https://www.python.org/)
- [Flask](http://flask.pocoo.org/)

## Installation

``` bash
git clone https://github.com/tohjustin/pomodori.git
cd ./pomodori
yarn
```

## Getting Started

``` bash
# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production with minification + serve build at localhost:5000 (Flask server)
yarn run serve

# run eslint
yarn run lint

# run unit tests
yarn run unit

# run eslint + unit tests
yarn test
```

This project's build setup is scaffolded by the [vue-cli](https://github.com/vuejs/vue-cli) project. For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for pwa-template](https://github.com/vuejs-templates/pwa).


## License

MIT © [Justin Toh](https://github.com/tohjustin)
