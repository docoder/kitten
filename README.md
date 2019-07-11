<p align="center">
  <a href="#">
    <img alt="kitten" src="https://raw.githubusercontent.com/docoder/kitten/master/assets/kitten.png" width="128">
  </a>
</p>
<h3 align="center">
  Kitten
</h3>
<div align="center">
  Server JSON Driving UI

 [![NPM](https://img.shields.io/npm/v/kittenjs.svg)](https://www.npmjs.com/package/kittenjs)  [![NPM](https://img.shields.io/npm/v/kittenjs-default-render.svg)](https://www.npmjs.com/package/kittenjs-default-render)

</div>

## ⚠️ Warning

#### Kitten (kittenjs and kittenjs-default-render) is under active development

#### Its API is not stable

#### Use it at your own risk

## 📦 Installation

#### 1.kittenjs

```bash
yarn add react kittenjs
```

#### 2.kittenjs-default-render

```bash
yarn add react-dom react-reconciler react-router-dom antd ant-colony-ui styled-components kittenjs-default-render
```

## ⌨️ Development

#### 1.install

```bash
cd kittenjs
yarn

cd kittenjs-default-render
yarn

cd example
yarn
```

#### 2.link

```bash
cd kittenjs
yarn link
# Fix Duplicate React: https://github.com/facebook/react/issues/15315#issuecomment-479802153
npm link ../example/node_modules/react

cd kittenjs-default-render
yarn link
yarn link "kittenjs"
npm link ../example/node_modules/react

cd example
yarn link "kittenjs"
yarn link "kittenjs-default-render"
```

#### 3.run in development mode

```bash
cd kittenjs
yarn start

cd kittenjs-default-render
yarn start

cd example
yarn run dev
```

## 🔨 Usage

**You can see [example ](https://github.com/docoder/kitten/tree/master/example) for detail**

```typescript
import { default as Kitten } from 'kittenjs'
import Renderer from 'kittenjs-default-render'
import Sub1ListPlugin from './plugins/Sub1ListPlugin'
import OtherListPlugin from './plugins/OtherListPlugin'
const app = new Kitten({
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

