import { Kitten, PageSection } from 'kittenjs'
import { Renderer, ui } from 'kittenjs-default-ui'
import Sub1ListPlugin from './plugins/Sub1ListPlugin'
import OtherListPlugin from './plugins/OtherListPlugin'
import OtherRoutePagePlugin from './plugins/OtherRoutePagePlugin'
import GlobalCustomPlugin from './plugins/GlobalCustomPlugin'
const dashbordJSON: PageSection[] = [
    {
        type: 'Panel', 
        key: 'dashboard1Panel',
        items: [
            {
                type: 'Panel',
                key: 'dashboardItemPanel1',
                items: [
                    {key: 'field11', label: '字段11', value: '值11'},
                    {key: 'field12', label: '字段12', value: '值12'},
                ],
                meta: {
                    label: '面板1',
                    width: '10%'
                }
            },
            {
                type: 'Panel',
                key: 'dashboardItemPanel2',
                items: [
                    {key: 'field21', label: '字段21', value: '值21'},
                    {key: 'field22', label: '字段22', value: '值22'},
                    {key: 'field23', label: '字段23', value: '值23'},
                ],
                meta: {
                    label: '面板2',
                    width: '15%',
                    headerColor: 'white',
                    headerBgColor: '#42A881'
                }
            },
            {
                type: 'Panel',
                key: 'dashboardItemPanel3',
                items: [
                    {key: 'field31', label: '字段31', value: '值31'},
                    {key: 'field32', label: '', value: '值32', size: 'extrabig'},
                    {key: 'field33', label: '字段33', value: '值33'},
                    {key: 'field34', label: '字段34', value: '值34'}
                ],
                meta: {
                    label: '面板3',
                    width: '25%',
                    columnsCount: 1
                }
            },
            {
                type: 'Panel',
                key: 'dashboardItemPanel4',
                items: [
                    {key: 'field41', label: '字段41', value: '值41', size: 'big'},
                    {key: 'field42', label: '字段42', value: '值42', size: 'big'},
                    {key: 'field43', label: '字段43', value: '值43', meta: {url: 'http://example.com/43', method: 'GET'}},
                    {key: 'field44', label: '字段44', value: '值44', meta: {href: 'http://example.com/44'}},
                    {key: 'field45', label: '字段45', value: '值45', meta: {link: '/sub1'}}
                ],
                meta: {
                    label: '面板4',
                    width: '50%',
                    columnsCount: 2
                }
            }
        ],
        meta: {
            label: '版块1',
            direction: 'horizontal'
        }
    },
    {
        type: 'Panel', 
        key: 'dashboard2Panel',
        items: [
            {
                type: 'Panel',
                key: 'dashboard2ItemPanel1',
                items: [
                    {key: 'field11', label: '字段11', value: '值11'},
                    {key: 'field12', label: '字段12', value: '值12'},
                ],
                meta: {
                    label: '标题'
                }
            },
            {
                type: 'Form', 
                key: 'form1',
                items: [
                    {key: 'id', label: 'ID'},
                    {
                        key: 'info',
                        label: '信息',
                    } 
                ],
                meta: {
                    filter: 'table1',
                    actionDirection: 'left'
                }
            },
            {
                type: 'Table',
                key: 'table1',
                items: [
                    {key: 'id', label: 'ID'},
                    {
                        key: 'info',
                        label: '信息',
                    }
                ],
                meta: {
                    data: [
                        {
                            id: 1,
                            info: 'testInfo1'
                        }
                    ],
                    url:
                    'https://api.example.com/sub2/list',
                    method: 'GET',
                    disablePagination: true
                },
            },
            {
                key: 'btn1',
                type: 'Button',
                meta: {
                    label: '按钮'
                }
            }, 
        ],
        meta: {
            label: '版块2'
        }
    },
    {
        type: 'Stack', 
        key: 'iframesStack',
        items: [
            {
                type: 'Iframe',
                key: 'dashboardIframe1',
                meta: {
                    href: window.location.origin,
                    block: true,
                    style: {flex: 1, height: 300}
                }
            },
            {
                type: 'Iframe',
                key: 'dashboardIframe2',
                meta: {
                    href: window.location.origin,
                    block: true,
                    style: {flex: 1, height: 300}
                }
            }
        ],
        meta: {
            direction: 'horizontal'
        }
    }
]
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
                    link: '/sub2'  // / 表示为根页面，非子页面
                }
            },
            {
                key: 'download',
                type: 'Button',
                meta: {
                    label: '下载模板',
                    href: 'https://api.example.com/sub1/download'
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
            {key: 'id', label: 'ID', placeholder: '请输入唯一标识'},
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
            submitTitle: '查询',
            clearTitle: '清空'
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
                key: 'time1',
                label: '时间1',
                meta: {
                    format: 'timestamp$:YYYY-MM-DD HH:mm:ss'
                }
            },
            {
                key: 'time2',
                label: '时间2',
                meta: {
                    format: 'date$:YYYY-MM-DD HH:mm:ss'
                }
            },
            {
                key: 'sql',
                label: 'SQL',
                width: '200px',
                meta: {
                    format: 'code$:sql'
                }
            },
            {
                key: 'code',
                label: '代码',
                meta: {
                    format: 'code$:java',
                    width: '200px'
                }
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
                                items: '$.items',
                                time1: '$.time1',
                                time2: '$.time2',
                                code: '$.code'
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
                    time1: '15441703671111',
                    time2: '2019-10-15T09:12:57.000Z',
                    sql: 'SELECT 0 AS id, 0 AS c_id, 0 AS o_id, 0 AS r_id, 0 AS w_id FROM table',
                    code: `
public class HelloWorld {

    public static void main(String[] args) {
        // Prints "Hello, World" to the terminal window.
        System.out.println("Hello, World");
    }

}
                        `
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
                    },
                    {
                        key: 'date',
                        label: '时间',
                        type: 'date',
                        showTime: true
                    },
                    {
                        key: 'code',
                        label: '代码',
                        type: 'codeEditor'
                    }
                ],
                meta: {
                    url: 'https://api.example.com/addSub1',
                    modal: 'sub1AddModal',
                    method: 'POST',
                    columnsCount: 2,
                    actionDirection: 'left',
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
                    {
                        key: 'code',
                        label: '代码',
                        value: '$.code',
                        type: 'codeEditor'
                    },
                    {
                        key: 'time1',
                        label: '时间1',
                        value: '$.time1',
                        disabled: true,
                        meta: {
                            format: 'timestamp$:YYYY-MM-DD HH:mm:ss'
                        }
                    },
                    {
                        key: 'time2',
                        label: '时间2',
                        value: '$.time2',
                        meta: {
                            format: 'date$:YYYY-MM-DD HH:mm:ss'
                        }
                    },
                ],
                meta: {
                    url: 'https://api.example.com/sub1/edit',
                    modal: 'sub1EditModal',
                    method: 'POST',
                    labelPosition: 'top',
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
        type: 'Tabs',
        key: 'subSub1Tabs',
        items: [
            {
                key: 'tab1',
                label: '选项1',
                items: [
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
                            disablePagination: true
                        },
                    }
                ]
            },
            {
                key: 'tab2',
                label: '选项2',
                items: [
                    {
                        key: 'tab2Button',
                        type: 'Button',
                        meta: {
                            label: '选项2按钮'
                        }
                    }
                ]
            }
        ]
    }
    
]

const subSub1PageJSON: PageSection[] = [
    {
        type: 'Iframe',
        key: 'iframe1',
        meta: {
            href: window.location.origin,
            offset: 64
        }
    }
]

const app = new Kitten(ui, {
    appKey: "ke",
    appTitle: 'Kitten Example',
    pageAPI: 'http://api.example.com/pages',
    // loginUrl: 'http://api.example.com/login',
    loginUrl:'/login',
    logoutBtnCallback: () => {},
    menus: [
        {
            key: 'dashbord',
            label: '仪表盘',
            pageJSON: JSON.parse(JSON.stringify(dashbordJSON)), 
        }, {
            label: '菜单 1',
            subs: [
                {
                    label: '子菜单 1', 
                    key: 'sub1',
                    index: true,
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
                            },{
                                key: 'toSubSub',
                                type: 'Button',
                                meta: {
                                    label: '孖页面',
                                    link: 'subSubPage'
                                }
                            }],
                            subPages: [
                                {
                                    key: 'subSubPage',
                                    label: '孖页面1',
                                    pageJSON: [{
                                        key: 'backToSubSub1',
                                        type: 'Button',
                                        meta: {
                                            label: '返回',
                                            link: '<'
                                        }
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '子菜单 2', 
                    key: 'sub2',
                    pageJSON: JSON.parse(JSON.stringify(sub2PageJSON))
                },
                {
                    label: '子菜单 3', 
                    key: 'sub3',
                    subs: [
                        {
                            label: '孖菜单', 
                            key: 'subSub1',
                            pageJSON: JSON.parse(JSON.stringify(subSub1PageJSON))
                        }
                    ]
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
    new OtherListPlugin(),
    new OtherRoutePagePlugin(),
    new GlobalCustomPlugin()
], [
    'beforeTableColumnFinalization'
])
app.render(Renderer,  document.getElementById('root')!)