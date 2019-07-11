<p align="center">
  <a href="#">
    <img alt="kitten" src="https://raw.githubusercontent.com/docoder/kitten/master/assets/kitten.png" width="128">
  </a>
</p>
<h3 align="center">
  Kitten
</h3>
<p align="center">
  Server JSON Driving UI
</p>

## ⚠️ Warning

#### Kittenjs and Kittenjs-default-render is under active development!

####Its API is not stable

####**Use it at your own risk**

## Installation

#### 1.kittenjs

```bash
yarn add react kittenjs
```

#### 2.kittenjs-default-render

```bash
yarn add react-dom react-reconciler react-router-dom antd ant-colony-ui kittenjs-default-render
```

## Development

####1.install

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

