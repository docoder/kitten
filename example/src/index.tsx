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
                key: 'link',
                type: 'Button',
                meta: {
                    label: 'sub2页面',
                    link: '/sub2'  // / 表示为跟页面，非子页面
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
                    },
                    {
                        key: 'sub1Subpage',
                        meta: {
                            label: '子页面',
                            link: 'subpage'
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
                    items: [
                        {province: '0', provinceName: '北京', city: '0', cityName: '北京', item: '项目1'},
                        {province: '1', provinceName: '山东', city: '1', cityName: '烟台', item: '项目2'}
                    ],
                },
                {
                    id: 2,
                    number: '',
                    typeId: '0',
                    type: '类型1',
                    items: [
                        {province:'1', provinceName: '山东', city:'2', cityName: '济南', item: '项目1'},
                        {province:'1', provinceName: '山东', city:'3', cityName: '青岛', item: '项目1'}
                    ]
                },
                {
                    id: 3,
                    number: null,
                    typeId: '1',
                    type: '类型2',
                    items: [
                        {province:'1', provinceName: '山东', city:'3', cityName: '青岛', item: '项目1'}
                    ],
                },
                {
                    id: 4,
                    number: 'test-222',
                    typeId: '2',
                    type: '类型3',
                    items: [
                        {province:'1', provinceName: '山东', city:'1', cityName: '烟台', item: '项目1'},
                        {province:'1', provinceName: '山东', city:'1', cityName: '烟台', item: '项目2'}
                    ],
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
                key: 'sub1AddItemButton',
                type: 'Button',
                meta: {
                    label: '添加项目',
                    modal: 'sub1AddItemModal'
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
                            key: 'sub1AddItemsTable',
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
                key: 'sub1AddItemModal',
                items: [
                    {
                        type: 'Form',
                        key: 'sub1Filter',
                        items: [
                            {
                                key: 'province',
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
                                label: '项目'
                            }
                        ],
                        meta: {
                            columnsCount: 1,
                            componentKey: 'sub1AddItemsTable',
                            modal: 'sub1AddItemModal'
                        },
                    }
                ],
                meta: {
                    label: '添加项目',
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
                            key: 'sub1EditItemsTable',
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
                                        }
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
                                params: {
                                    form: {key: 'items', fields: ['province', 'city', 'item']},
                                }
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
            method: 'GET'
        },
    }
]

const app = new Kitten(ui, {
    appKey: "ke",
    appTitle: 'Kitten Example',
    pageAPI: 'http://api.example.com/pages',
    loginUrl: 'http://api.example.com/login',
    logoutBtnCallback: () => {},
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
                    pageJSON: JSON.parse(JSON.stringify(sub1PageJSON)),
                    subPages: [
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
        }
    ],
}, [
    new Sub1ListPlugin(),
    new OtherListPlugin()
], [
    'beforeTableColumnFinalization'
])
app.render(Renderer,  document.getElementById('root')!)