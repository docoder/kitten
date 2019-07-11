import Kitten from 'kittenjs'
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
                    pageJSON: [
                        {
                            type: 'Form',
                            key: 'sub1Filter',
                            items: [
                                {key: 'id', label: 'ID'},
                                {key: 'number', label: '编码'},
                                {
                                    key: 'type',
                                    label: '类型',
                                    type: 'select',
                                    meta: {
                                        data: [
                                            {value: '0', label: '类型1'},
                                            {value: '1', label: '类型2'},
                                            {value: '2', label: '类型3'} 
                                        ],
                                        url:
                                            'https://api.example.com/types',
                                        method: 'GET',
                                    },
                                },
                            ],
                            meta: {
                                filter: 'sub1Table',
                            },
                        },
                        {
                            type: 'Table',
                            key: 'sub1Table',
                            items: [
                                {key: 'id', label: 'ID', id: true},
                                {
                                    key: 'number',
                                    label: '编号',
                                    // editable: {number: 'none'},
                                },
                                {key: 'type', label: '类型'},
                                {
                                    key: 'items',
                                    label: '项目',
                                    //render: 'split', render: '${number} - ${type}'
                                },
                            ],
                            meta: {
                                data: [
                                    {
                                        id: 1,
                                        number: 'test-111',
                                        typeId: '0',
                                        type: '类型1',
                                        items: '类型1项目',
                                    },
                                    {
                                        id: 2,
                                        number: '',
                                        typeId: '0',
                                        type: '类型1',
                                        items: '类型2项目',
                                    },
                                    {
                                        id: 3,
                                        number: null,
                                        typeId: '1',
                                        type: '类型2',
                                        items: '类型3项目',
                                    },
                                    {
                                        id: 4,
                                        number: 'test-222',
                                        typeId: '2',
                                        type: '类型3',
                                        items: '类型3项目',
                                    }
                                ],
                                url:
                                    'https://api.example.com/sub1/list',
                                method: 'GET',
                            },
                        }
                    ]
                },
                {
                    label: '子菜单 2', 
                    key: 'sub2',
                    pageJSON: [
                        {
                            type: 'Form',
                            key: 'sub2Filter',
                            items: [
                                {key: 'id', label: 'ID'},
                                {key: 'order', label: '单号'},
                                {
                                    key: 'user',
                                    label: '用户',
                                    type: 'select',
                                    meta: {
                                        data: [
                                            {value: '0', label: '用户1'},
                                            {value: '1', label: '用户2'},
                                            {value: '2', label: '用户3'}
                                        ],
                                        url:
                                        'https://api.example.com/users',
                                        method: 'GET',
                                    },
                                },
                            ],
                            meta: {
                                filter: 'sub2Table',
                            },
                        },
                        {
                            type: 'Table',
                            key: 'sub2Table',
                            items: [
                                {key: 'id', label: 'ID', id: true},
                                {
                                    key: 'order',
                                    label: '单号',
                                },
                                {key: 'user', label: '用户'},
                                {
                                    key: 'info',
                                    label: '信息',
                                },
                            ],
                            meta: {
                                data: [],
                                url:
                                'https://api.example.com/sub2/list',
                                method: 'GET',
                            },
                        }
                    ]
                }
            ]
        }
    ],
}, [
    new Sub1ListPlugin(),
    new OtherListPlugin()
], [
    'beforeTableColumnFinalization'
])
app.render(Renderer,  document.getElementById('root')!)