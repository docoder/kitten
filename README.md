<div align="center">
  <a href="#">
    <img alt="kitten" src="https://raw.githubusercontent.com/docoder/kitten/master/assets/kitten.png" width="128">
  </a>
  <h3 align="center">
    Kitten
    </h3>
</div>
<div align="center">
  Server JSON Driving UI

 [![NPM](https://img.shields.io/npm/v/kittenjs.svg)](https://www.npmjs.com/package/kittenjs)  [![NPM](https://img.shields.io/npm/v/kittenjs-default-ui.svg)](https://www.npmjs.com/package/kittenjs-default-ui)

</div>

## 📦 Installation

#### 1.kittenjs

```bash
yarn add react kittenjs
```

#### 2.kittenjs-default-ui

```bash
yarn add react-dom react-router-dom antd ant-colony-ui styled-components kittenjs-default-ui
```

## ⌨️ Development

#### 1.install

```bash
cd kittenjs
yarn install --ignore-scripts

cd kittenjs-default-ui
yarn install --ignore-scripts

cd example
yarn install --ignore-scripts
```

#### 2.link

```bash
cd kittenjs
yarn link
# Fix Duplicate React: https://github.com/facebook/react/issues/15315#issuecomment-479802153
npm link ../example/node_modules/react

cd kittenjs-default-ui
yarn link
yarn link "kittenjs"
npm link ../example/node_modules/react

cd example
yarn link "kittenjs"
yarn link "kittenjs-default-ui"
```

#### 3.run in development mode

```bash
cd kittenjs
yarn start

cd kittenjs-default-ui
yarn start

cd example
yarn run dev
```

## 🔨 Usage

**You can see [example ](https://github.com/docoder/kitten/tree/master/example) for detail**

```typescript
import { Kitten } from 'kittenjs'
import { Renderer, ui } from 'kittenjs-default-ui'
import Sub1ListPlugin from './plugins/Sub1ListPlugin'
import OtherListPlugin from './plugins/OtherListPlugin'
const app = new Kitten(ui, {
    appKey: "ke",
    appTitle: 'Kitten Example',
    pageAPI: 'http://api.example.com/pages',
    loginUrl: 'http://api.example.com/login',
    menus: [
        {
            key: 'dashbord',
            label: '仪表盘',
            index: true,
            pageJSON: []
        }, {
            label: '菜单 1',
            subs: [
                {
                    label: '子菜单 1',
                    key: 'sub1',
                },
                {
                    label: '子菜单 2',
                    key: 'sub2'
                }
            ]
        }
    ],
}, [
    new Sub1ListPlugin(), // plugins
    new OtherListPlugin()
], [
    'beforeTableColumnFinalization'  // debug kitten hooks
])
app.render(Renderer,  document.getElementById('root')!)
```

## License

MIT © [docoder](https://github.com/docoder)

