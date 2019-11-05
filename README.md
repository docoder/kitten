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

# 📦 Installation

#### 1.kittenjs

```bash
yarn add react kittenjs
```

#### 2.kittenjs-default-ui

```bash
yarn add react-dom react-router-dom antd ant-colony-ui styled-components kittenjs-default-ui
```

# ⌨️ Development

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

# 🔨 Usage

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

# 📖 Document

## Overview

```tsx
import { Kitten } from 'kittenjs' // 逻辑抽象层
import { Renderer, ui } from 'kittenjs-default-ui' // UI 渲染层

import YourPlugin from './plugins/YourPlugin'

const app = new Kitten(ui, { // 将 ui 传入，kitten 会使用此进行 UI 渲染
    appKey: '<--appKey-->',
    appTitle: '<--appTitle-->',
    pageAPI: '<--pageAPI-->',
    loginUrl: '<--loginUrl-->',
    menus: [], // 菜单配置
}, [
    new YourPlugin()
], [
])
app.render(Renderer,  document.getElementById('root')!)
```

## App

### appKey

- 唯一的应用标识，以字母开头的字母或数字及下划线组合

### appTitle

- 应用标题，会显示在页面标题位置

### pageAPI

- 接收 pageKey 作为参数，返回 pageJSON 的 API 接口

### loginUrl

- 统一的登录 URL
- 当应用其他接口返回 401 等，会跳转到此 URL

### menus

- 菜单配置

  ```json
  [
          {
              key: 'dashbord',
              label: '仪表盘',
              pageJSON: [...] // 如果配置了 pageJSON，将不会去请求 pageAPI 获得 pageJSON
          }, {
              label: '菜单 1',
              subs: [
                  {
                      label: '子菜单 1', 
                      key: 'sub1',
                      pageJSON: [...],
                      subPages: [ 	// KCP 暂不支持
                          {
                              key: 'subpage',
                              label: '子页面1',
                              pageJSON: [{
                                  key: 'backToSub1',
                                  type: 'Button',
                                  meta: {
                                      label: '返回',
                                      link: '<'
                                  }
                              }]
                          }
                      ]
                  },
                  {
                      label: '子菜单 2', 
                      key: 'sub2',
                      pageJSON: JSON.parse(JSON.stringify(sub2PageJSON))
                  }
              ]
          },
          {
              key: 'menu2',
              label: '菜单 2'
            	// 没有配置 pageJSON，将会用 key 作为参数，请求 pageAPI 来获取 pageJSON
          }
      ]
  ```

- 只要配置好 `Page` , 无需关心 menu 的配置

### Plugin

- kitten 支持插件，来满足特殊的交互或业务需求

  ```tsx
  import React from 'react'
  import { Plugin, AppHooks } from 'kittenjs'
  export default class YourPlugin implements Plugin {
      apply(hooks: AppHooks) {
          ...
      }
  }
  ```

- 需继承` Plugin` , 实现 `apply` 方法

- kitten 插件 理论上可以通过预先定义好的 hooks 在 kittenjs 的任何位置插入代码

- hooks 通过 `apply` 方法参数传入

  ```tsx
  ...
  apply(hooks: AppHooks) {
     hooks.beforeTableColumnFinalization.tap(
       'YourPlugin--beforeTableColumnFinalization', 
       (appkey: string, pageKey: string, tableKey:string, column: TableColumn) => {
         			// 通常需要通过 pageKey 以及相应组件的 key 等来确定你所关心的页面或组件等
              if (pageKey !== 'other' || tableKey !== 'yourTable') return;
              ...
        })
  }
  ...
  ```

- 目前 AppHooks 有 (还不完善，之后会根据业务需求来增加和迭代) :

  - afterPageLoaded
    - appKey, pageKey, props
    - 页面加载时调用
  - afterPageUnloaded
    - appKey, pageKey, props
    - 页面卸载时调用
  - afterComponentLoaded
    - appKey, pageKey, componentType, componentKey, props
    - 组件加载时调用
  - afterComponentUnloaded
    - appKey, pageKey, componentType, componentKey, props
    - 组件卸载时调用
  - beforeSelectDataFetched
    - appKey, pageKey, componentKey, items, selectKey
    - Form 或 Table 有 Select 时，在请求接口获取 Select 数据**前**调用
  - afterSelectDataFetched
    - appKey, pageKey, componentKey, items, selectKey, selectData
    - Form 或 Table 有 Select 时，在请求接口获取 Select 数据**后**调用
  - beforeTableDataSourceFetched
    - appKey, pageKey, tableKey, columns
    - Table 在请求接口获取数据**前**调用
  - afterTableDataSourceFetched
    - appKey, pageKey, tableKey, columns, dataSource
    - Table 在请求接口获取数据**后**调用
  - beforeFormItemFinalization
    - appKey, pageKey, formKey, item
    - 在 Form 的 每个item (表单条目) 最终确定前调用
  - beforeFormAllItemsFinalization
    - appKey, pageKey, formKey, items
    - 在 Form 的所有 items 最终确定前调用
  - beforeTableColumnFinalization
    - appKey, pageKey, tableKey, column
    - 在 Table 的每个 Column (列) 最终确定前调用
  - beforeTableAllColumnsFinalization
    - appKey, pageKey, tableKey, columns
    - 在 Table 的所有 Columns 最终确定前调用
  - beforeButtonClick
    - appKey, pageKey, buttonKey
    - 在 Button 点击前调用
  - beforeFormSubmit
    - appKey, pageKey, formKey, values
    - 在 Form 提交前调用
  - beforeCheckboxChange
    - appKey, pageKey, checkboxKey, value
    - 在 Checkbox 改变前调用
  - afterTableCellChanged
    - appKey, pageKey, tableKey, dataSource, row
    - 在 Table Cell 为可编辑时，值改变后调用

## Page

- pageKey
  - 唯一的页面标识，以字母开头的字母或数字及下划线组合
- 菜单名称
  - 菜单名称会显示在菜单栏，与 pageKey 一起形成菜单配置，挂载页面
- 菜单顺序
  - 决定菜单由上至下的排列顺序
- 父菜单名称
  - 起分组的作用，如果要在同一父菜单下，则须配置相同名称，不挂载页面

## Section

### key

- 唯一的组件块标识，以字母开头的字母或数字及下划线组合

### type

- 组件块类型
  - Table, Form, Button, Stack, Checkbox, Modal

### parentSectionKey

- 例如：Stack, Modal 可以有子 Section，当配置其子 Section 时需要填写父 Section 的 section key

### meta

#### url

- Form, Table
- Table 为数据请求接口
- Form 为表单提交接口

#### method

- Form, Table
- POST 或 GET

#### pageSize

- Table
- Table 分页时，可选配置

#### disablePagination

- Table
- 取消 Table 的分页

#### label

- Button, Modal
- Button 或 Modal 的标题

#### modal

- Button, Table, Form
- Button 点击要显示的 Modal 的 key
- 如果 Table 和 Form 为 Modal 的子 Section，需要配置 modal 为其 Modal 的 key，则可获取 Modal 弹起时获取的参数

#### accessories

- Form
- Form 的附加 sections

#### form

- Table
- 当 Table 作为 Form 的 accessories 时, 需要配置 form 为此 Form 的 key，这样 Form 才能获取 Table 的数据

#### params

- Table, Form
- 当 Table 作为 Form 的 accessories 时
  - params: {form: {key: ..., fields: [...]}}
  - key (字符串) 为 Form 提交时的字段，与提交接口字段名称一致
  - fields (字符串数组) 为 Table 中需要提交的字段，可选。如果不配置，则默认为全部字段。
- 当 Form 需要提交额外字段时
  - params: { get/post: {key1: '$.key1', key2: 'key2'}}
  - get 或 post 对应提交接口 method 为 GET 或 POST
  - key1 和 key2 为提交的额外字段，会成为请求接口的参数
  - 如果 Form 为 Modal 的子 section，则提交字段的 value (以 $. 开头) 可以获取 Modal 弹起时获取的参数

#### width

- Modal
- Modal 的宽度 (数字类型), 如：800

#### filter

- Form
- 当 Form 为 Table 的搜索筛选表单时
  - filter 填写为此 Table 的 key，即可完成其 Form 提交携带新参数重新请求 Table 数据接口的功能

#### direction

- Stack
- Stack 是一个布局 section, 分为由上到下垂直布局和由左到右水平布局
- horizontal，水平布局
- vertical，垂直布局

#### columnsCount

- Form
- Form 的表单条目的列数，用于布局

#### rowColCounts

- Form
- Form 表单条目每行布局几个条目，不能超过 columnsCount, 用于布局
- 例如： [2, 1, 3]
  - 第一行 2 个，第二行  1 个，第三行 3 个，第四行及其下面都为 3 个

#### disableGroupCol

- Form
- 用于布局，当 Form 里有 checkbox 群时，将其置为 true, 可能会使布局更紧凑

#### style

- Table, Form, Stack, Button, Modal, Checkbox
- 可以写自定义样式，用于修正布局或样式

#### link

- Button
- 页面跳转
- '/pageKey'，/ 表示为根页面，非子页面
- 'subPageKey', 子页面
- '<', 页面返回上一页面

#### componentKey

- Form
- Form 提交时需要把提交的数据传递给某个组件，设置为此组件的 key
  - 通常为某一页面在某一操作弹起 Modal 时，其中的 Form 提交后需把提交的数据传递到此页面的 Table 中，如新建此页面 Table 的条目时

#### alias

- Table
- 当接口字段与配置字段格式不一致时，需要配置
- Table 分页数据不一致时
  - alias: { currentPage: 'page', pageSize: 'pagesize', total: 'paginate.total'}
  - 字段支持属性嵌套，如，paginate.total

#### actionsShow

- Form
- 是否显示 Form 的提交重置按钮，当 Form 用于纯展示时，可设为 true

#### labelPostion

- Form
- Form 布局，支持 left, top, horizontal, vertical, inline
  - left: label 在左边，每行左对齐
  - top: label 在上边，输入框和 label 对齐，并一起左对齐
  - horizontal: label 在左边, 每行输入框对齐，label 右对齐
  - vertical: 与 top 类似，但使用的是 row col 布局
  - inline: 行内布局

### items 

Form 或 Table 中的条目

#### key

- Form, Table
- 字段名称，需跟接口字段一致

#### label

- Form, Table
- 字段标签名称

#### type

- Form, Table
- Form 的条目输入类型，默认为 input
  - input, select, radio, checkbox, textArea, date, rangeDate, month, info, codeEditor
- 当 Table 配置 editable 为 true 时，可以配置 type 类型，默认为 input
  - input, select, tags, multiple

#### showTime

- Form
- Form 的条目 type 为 date, 或 rangeDate时有效
- 是否增加日期的时间选择

#### id

- Table
- 为 true 时，用此字段作为 Table 的唯一标识 rowKey

#### actionDisabled

- Form
- 为 true 时，Form 不会提交此字段

#### required

- Form, Table
- 为true时，此字段为必填
- Table 时，需配置 editable 为 true 时才生效

#### editable

- Table
- 为 true 时，Table 此字段可编辑，默认为 input

#### reg

- Form, Table
- 正则匹配
- 如：reg: {pattern: '^([1-9][0-9]*)?[05]$', message: '请输入5的倍数'}
  - pattern 为正则表达式字符串
  - message 为不满足正则时的提示信息

#### value

- Form, Table
- 默认值

#### disabled

- Form, Table
- 禁止输入

#### actions

- Table

- 配置为 Table 的操作列

  ```js
  actions: [
    {
      key: 'yourTableEdit',
      meta: {
        label: '修改',
        modal: 'yourTableEditModal',
        // $. 取 table record
        // $# 取 url 请求数据
        params: {
          get: {
            id: '$.id'
          },
          id: '$.id',
          field1: '$#field1'
        },
        url: '...',
        method: 'GET'
      }
    },
    {
      key: 'yourTableDelete',
      meta: {
        label: '删除',
        confirm: true,
        confirmLabel: '确定删除?',
        url: '...,
        method: 'POST',
        params: {
          post: {
            id: '$.id'
          }
        }
      }
    }
  ]
  ```

  - key

    - 唯一标识

  - meta

    - label

      - 操作按钮标题

    - url

      - 操作按钮点击请求的 URL

    - method

      - 操作按钮点击请求的 method

    - modal

      - 操作按钮点击弹起 Modal 的 key

    - params

      - get 或 post 可以在请求 url 时增加请求参数，需与 method 的 GET 或 POST 一致
      - 其他字段，当配置了 modal 时有效，会将其传递给 key 为 modal 配置值 的 Modal
      - 字段值，可以为 `$.` 或 `$#` 开头
        - `$.` 会取 Table 中的字段值
        - `$#` 会取请求 url 返回数据中的字段值

    - confirm

      - 操作按钮点击是否需要确认操作
      - 如**删除**操作经常需要确认，则将其置为true

    - confirmLabel

      - 操作确认弹出框的提示信息
      - 如： '确定删除?'

    - rowAction

      ```js
      actions: [
        {
          key: "add",
          meta: {
            label: "添加",
            rowAction: "insert"
          }
        },
        {
          key: "delete",
          meta: {
            label: "删除",
            rowAction: "delete"
          }
        }
      ]
      ```

      - insert，当点击操作按钮时，会增加一行；当 Table 为空时，此按钮会显示为占位符位置，点击可增加一行
      - delete，当点击操作按钮时，会删除一行

    - link

      - 跳转页面，同 Section meta 中的 link

#### alias

- Form, Table
- 当请求接口字段与 key 不一致时，需要配置此字段为接口请求字段
- 为字符串，只能配置一个字段的别称，与 section meta 中 alias 不同

#### meta

- format
  - Table,  Form
  - Table 列的格式化，支持 三种，timestamp，date，code，需要以 `$:`分隔
    - timestamp`$:`YYYY-MM-DD HH:mm:ss
    - date`$:`YYYY-MM-DD HH:mm:ss
    - code`$:`java，支持四种
      - java
      - jsx
      - tsx
      - sql
  - Form item value (默认值) 的格式化 (仅在 disabled 时才生效)
    - 常用于用 Form 来显示数据时进行格式化
    - 支持两种，timestamp，date 需要以 `$:`分隔
      - timestamp`$:`YYYY-MM-DD HH:mm:ss
      - date`$:`YYYY-MM-DD HH:mm:ss

**当 Form 或 Table 的条目 type 为 select 类型 (包括 tags, multiple) 时有效 **

- url
  - Form, Table
  - 请求 select 数据 URL
- method
  - Form, Table
  - 请求 select 数据 method
- ref
  - Form, Table
  - 联动依赖的条目的 key
- refData
  - Form, Table
  - 以联动依赖的条目 (以 ref 为 key的条目) 的值为键的全量字典
  - 当联动依赖的条目选择改变时，根据其值查找字典返回其本身的 select 数据
- data
  - Form, Table
  -  select 数据
  - [{value: '1', label:'值1' }, {value: '2', label: '值2'}]
- alias
  - Form, Table
  - 当 select 数据接口的条目字段不是 value 和 label时，需要配置 value 和 label
    - {value: "yourValueKey", label: "yourLabelKey"}

# License

MIT © [docoder](https://github.com/docoder)

