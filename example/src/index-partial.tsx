import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { AppProvider, Entry, PageSection } from 'kittenjs'
import { ui } from 'kittenjs-default-ui'
import Page1ListPlugin from './plugins/Page1ListPlugin'
const page1JSON: PageSection[] = [
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
                    label: 'page2页面',
                    link: '/page2'  // / 表示为根页面，非子页面
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

function Header(props: any): JSX.Element {
    return (
        <div>
            <Entry
                pageKey="test-entry-header"
                pageJSON={[
                    {
                        key: 'header',
                        type: 'Button',
                        meta: {
                            label: 'Header'
                        }
                    }
                ]}
            />
        </div>
    )
}
function Page1(props: any): JSX.Element {
    return (
        <div>
            <Entry
                pageAPI="http://api.example.com/pages"
                pageKey="test-entry-page1"
                pageJSON={JSON.parse(JSON.stringify(page1JSON))}
                history={props.history}
                match={props.match}
            />
        </div>
    )
}
function Page1Sub(props: any): JSX.Element {
    return (
        <div>
            <Entry
                pageAPI="http://api.example.com/pages"
                pageKey="test-entry-page1-sub"
                pageJSON={[
                    {
                        key: 'backToSub1',
                        type: 'Button',
                        meta: {
                            label: '返回',
                            link: '<'
                        }
                    }
                ]}
                history={props.history}
            />
        </div>
    )
}

function Page2(props: any): JSX.Element {
    return (
        <div>
            <Entry
                pageAPI="http://api.example.com/pages"
                pageKey="test-entry-page2"
                pageJSON={[
                    {
                        key: 'page2Btn',
                        type: 'Button',
                        meta: {
                            label: '页面2'
                        }
                    }
                ]}
            />
        </div>
    )
}

function App (props: any): JSX.Element {
    return (
        <div>
            <Header />
            <Router>
                <Route exact path="/" component={() => <Redirect to="/main" />} />
                <Route exact path="/main" component={Page1} />
                <Route path="/main/subpage" component={Page1Sub} />
                <Route path="/page2" component={Page2} />
            </Router>
        </div>
        
    )
}

ReactDOM.render(
    <AppProvider 
        ui={ui} 
        config={{
            appKey: 'Test-Entry'
        }} 
        plugins={[
            new Page1ListPlugin() 
        ]}
        debugHooks={[
            'beforeTableColumnFinalization'
        ]}
    >
        <App />
    </AppProvider>, 
    document.getElementById('root')
);