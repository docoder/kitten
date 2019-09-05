import { Kitten, PageSection } from 'kittenjs'
import { Renderer, ui } from 'kittenjs-default-ui'
import Sub1ListPlugin from './plugins/Sub1ListPlugin'
import OtherListPlugin from './plugins/OtherListPlugin'
const sub1PageJSON: PageSection[] = [
    {
        type: 'Stack',
        key: 'sub1ButtonsStack',
        items: [
            {
                key: 'addSub1',
                type: 'Button',
                meta: {
                    label: '新建',
                    modal: 'sub1AddModal'
                }
            },
            {
                key: 'download',
                type: 'Button',
                meta: {
                    label: '下载模板',
                    url: 'https://api.example.com/sub1/download'
                }
            }
        ],
        meta: {
            direction: 'horizontal'
        }
    },
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
                    alias: {
                        label: 'typeName',
                        value: 'typeId'
                    }
                    // url:
                    //     'https://api.example.com/types',
                    // method: 'GET',
                },
            },
            {
                key: 'province',
                actionDisabled: true,
                label: '省',
                type: 'select',
                meta: {
                    data: [
                        {value: '0', label: '北京'},
                        {value: '1', label: '山东'},
                    ]
                }
            },
            { 
                key: 'city', 
                label: '城市',
                type: 'select',
                alias: 'cityId',
                meta: {
                    ref: 'province',
                    refData: {
                        '0': [{value: '0', label: '北京'}],
                        '1': [{value: '1', label: '烟台'}, {value: '2', label: '济南'}, {value:'3', label: '青岛'}]
                    },
                    // url: 'https://api.example.com/cities?provinceId=$refValue',
                    // method: 'GET'
                }
            }
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
            },
            {key: 'type', label: '类型'},
            {
                key: 'items',
                label: '项目',
            },
            {
                key: 'operations',
                label: '操作',
                actions: [
                    {
                        key: 'sub1Edit',
                        meta: {
                            label: '编辑',
                            modal: 'sub1EditModal',
                            // $. 取 table record
                            // $# 取 url 请求数据
                            params: {
                                number: '$.number',
                                type: '$.type',
                                items: '$.items'
                            },
                            // url: 'https://api.example.com/beforeSub1Edit',
                            // method: 'GET'
                        }
                    }
                ]
            }
        ],
        meta: {
            data: [
                {
                    id: 1,
                    number: 'test-111',
                    typeId: '0',
                    type: '类型1',
                    items: '北京-北京-项目1;山东-烟台-项目2',
                },
                {
                    id: 2,
                    number: '',
                    typeId: '0',
                    type: '类型1',
                    items: '山东-济南-项目1;山东-青岛-项目1',
                },
                {
                    id: 3,
                    number: null,
                    typeId: '1',
                    type: '类型2',
                    items: '山东-青岛-项目1',
                },
                {
                    id: 4,
                    number: 'test-222',
                    typeId: '2',
                    type: '类型3',
                    items: '山东-烟台-项目1;山东-烟台-项目2',
                }
            ],
            pageSize: 1,
            alias: {
                currentPage: 'page',
                pageSize: 'size',
                total: 'paginate.total' 
            },
            url:
                'https://api.example.com/sub1/list',
            method: 'GET',
        }
    },
    {
        type: 'Modal',
        key: 'sub1AddModal',
        items: [
            {
                key: 'testNestModal',
                type: 'Button',
                meta: {
                    label: '嵌套 Modal',
                    modal: 'testNestModalModal'
                }
            },
            {
                type: 'Form',
                key: 'sub1AddForm',
                items: [
                    {key: 'number', label: '编码', required: true},
                    {
                        key: 'type',
                        label: '类型',
                        type: 'select',
                        required: true,
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
                    }
                ],
                meta: {
                    url: 'https://api.example.com/addSub1',
                    modal: 'sub1AddModal',
                    method: 'POST',
                    columnsCount: 2,
                    accessories: [
                        {
                            type: 'Table',
                            key: 'sub1AddItems',
                            items: [
                                {
                                    key: 'province',
                                    label: '省',
                                    editable: true,
                                    type: 'select',
                                    meta: {
                                        data: [
                                            {value: '0', label: '北京'},
                                            {value: '1', label: '山东'},
                                        ], 
                                    }
                                },
                                {
                                    key: 'city',
                                    label: '城市',
                                    editable: true,
                                    type: 'select',
                                    meta: {
                                        ref: 'province',
                                        refData: {
                                            '0': [{value: '0', label: '北京'}],
                                            '1': [{value: '1', label: '烟台'}, {value: '2', label: '济南'}, {value:'3', label: '青岛'}]
                                        },
                                    }
                                },
                                {
                                    key: 'item',
                                    label: '项目',
                                    editable: true
                                },
                                {
                                    key: 'operations',
                                    label: '操作',
                                    actions: [
                                        {
                                            key: 'addSub2',
                                            meta: {
                                                label: '添加',
                                                rowAction: 'insert'
                                            }
                                        }, 
                                        {
                                            key: 'deleteSub2',
                                            meta: {
                                                label: '删除',
                                                rowAction: 'delete'
                                            }
                                        }
                                    ]
                                }
                            ],
                            meta: {
                                data: [
                                    {
                                        key: 1,
                                        province: '',
                                        city: '',
                                        item: ''
                                    }
                                ],
                                label: '项目',
                                form: 'sub1AddForm',
                                params: {form: {key: 'items', fields: ['province', 'city', 'item']}},
                            }
                        }
                    ]
                },
            },
            {
                type: 'Modal',
                key: 'testNestModalModal',
                items: [],
                meta: {
                    label: '嵌套 Modal',
                    width: 600
                }
            }
        ],
        meta: {
            label: '新建',
            width: 800
        }
    },
    {
        type: 'Modal',
        key: 'sub1EditModal',
        items: [
            {
                type: 'Form',
                key: 'sub1EditModal',
                items: [
                    {key: 'number', label: '编码', required: true, value: '$.number'},
                    {
                        key: 'type',
                        label: '类型',
                        type: 'select',
                        required: true,
                        value: '$.type',
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
                    url: 'https://api.example.com/sub1/edit',
                    modal: 'sub1EditModal',
                    method: 'POST',
                    columnsCount: 2,
                    accessories: [
                        {
                            type: 'Table',
                            key: 'sub1AddItems',
                            items: [
                                {
                                    key: 'province',
                                    label: '省',
                                    editable: true,
                                    type: 'select',
                                    meta: {
                                        data: [
                                            {value: '0', label: '北京'},
                                            {value: '1', label: '山东'},
                                        ], 
                                    }
                                },
                                {
                                    key: 'city',
                                    label: '城市',
                                    editable: true,
                                    type: 'select',
                                    meta: {
                                        ref: 'province',
                                        refData: {
                                            '0': [{value: '0', label: '北京'}],
                                            '1': [{value: '1', label: '烟台'}, {value: '2', label: '济南'}, {value:'3', label: '青岛'}]
                                        },
                                    }
                                },
                                {
                                    key: 'item',
                                    label: '项目',
                                    editable: true
                                },
                                {
                                    key: 'operations',
                                    label: '操作',
                                    actions: [
                                        {
                                            key: 'addSub2',
                                            meta: {
                                                label: '添加',
                                                rowAction: 'insert'
                                            }
                                        }, 
                                        {
                                            key: 'deleteSub2',
                                            meta: {
                                                label: '删除',
                                                rowAction: 'delete'
                                            }
                                        }
                                    ]
                                }
                            ],
                            meta: {
                                data: '$.items',
                                label: '项目',
                                modal: 'sub1EditModal',
                                form: 'sub1AddForm',
                                params: {form: {key: 'items', fields: ['province', 'city', 'item']}},
                            }
                        }
                    ]
                },
            }
        ],
        meta: {
            label: '编辑 {$.number}',
            width: 800
        }
    } 
]
const sub2PageJSON: PageSection[] = [
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
            {key: 'id', label: 'ID'},
            {
                key: 'order',
                label: '单号',
                editable: true,
                reg: { pattern: '^[A-Z0-9]{9}$', message: '格式输入有误！'},
                meta: {
                    url: 'https://api.example.com/updateList',
                    method: 'POST',
                    params: {
                        post: {
                            id: '$.id',
                            order: '$.order'
                        }
                    }
                },
            },
            {
                key: 'user', 
                label: '用户', 
                editable: true, 
                type: 'select', 
                meta: {
                    data: [
                        {value: '1', label: 'test1'},
                        {value: '2', label: 'test2'}
                    ]
                }
            },
            {
                key: 'info',
                label: '信息',
            }
        ],
        meta: {
            data: [
                {
                    id: 1,
                    order: '123456789',
                    user: '1',
                    info: 'testInfo1'
                }
            ],
            url:
            'https://api.example.com/sub2/list',
            method: 'GET',
        },
    }
]

const app = new Kitten(ui, {
    appKey: "ke",
    appTitle: 'Kitten Example',
    pageAPI: 'http://api.example.com/pages',
    loginUrl: 'http://api.example.com/login',
    menus: [
        {
            key: 'dashbord',
            label: '仪表盘',
            pageJSON: []
        }, {
            label: '菜单 1',
            subs: [
                {
                    label: '子菜单 1', 
                    key: 'sub1',
                    pageJSON: JSON.parse(JSON.stringify(sub1PageJSON)) 
                },
                {
                    label: '子菜单 2', 
                    key: 'sub2',
                    pageJSON: JSON.parse(JSON.stringify(sub2PageJSON))
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