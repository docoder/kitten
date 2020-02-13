import React from 'react';
import { Plugin, AppHooks, TableColumn } from 'kittenjs'
export default class Sub1ListPlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.beforeTableColumnFinalization.tap(
            'Sub1List--beforeTableColumnFinalization',
            (appKey: string, pageKey: string, tableKey: string, props: any, column: TableColumn) => {
                if (appKey !== 'ke' || pageKey !== 'sub1' || tableKey !== 'sub1Table') return;
                if (column.key === 'number') {
                    column.editable = (record: any) => {
                        return record.id % 2 === 0;
                    };
                }
                if (column.key === 'items') {
                    column.render = (text: string, record: any) => {
                        const items = record.items
                        return items.map((i: any, index: number) => (
                            <div key={index}>{`${i.provinceName}-${i.cityName}-${i.item}`}</div>
                        ));
                    };
                }
            },
        );
        hooks.beforeTablePaginationFinalization.tap('Sub1List--beforeTablePaginationFinalization', (
            appKey: string, pageKey: string, tableKey: string, props: any, dataSource: any, pagination: any 
        ) => {
            if (appKey !== 'ke' || pageKey !== 'sub1' || tableKey !== 'sub1Table') return;  
            pagination.extraPagination = {showTotal: (total: number) => `共 ${(pagination.total / pagination.pageSize)} 页, 共 ${total} 条数据`}
        })
        hooks.beforePanelFetch.tap('Sub1List--beforePanelFetch', (appKey: string, pageKey: string, panelKey: string, props: any) => {
            if (appKey !== 'ke' || pageKey !== 'dashbord' || panelKey !== 'dashboardItemPanel4') return;  
            props.meta.params = {get: {customParam: '1'}}
            console.log('Sub1List--beforePanelFetch', props)
        })
        hooks.afterComponentLoaded.tap('Sub1List--afterComponentLoaded', (appKey: string, pageKey: string, componentType: string, componentKey: string, props: any, rest: any) => {
            if (appKey !== 'ke' || pageKey !== 'sub1' || componentKey !== 'sub1Table') return;  
            props.meta.params = {get: {customParam: '1'}}
            console.log('Sub1List--afterComponentLoaded--rest', rest)
        })
        hooks.beforeTableDataSourceFetched.tap(
            'Sub1List--beforeTableDataSourceFetched', 
            (appKey: string, pageKey: string, tableKey: string, columns: any, pagination: any) => {
                if (appKey !== 'ke' || pageKey !== 'sub1' || tableKey !== 'sub1Table') return; 
        })
        hooks.afterTableDataSourceFetched.tap(
            'Sub1List--afterTableDataSourceFetched', 
            (appKey: string, pageKey: string, tableKey: string, columns: any, dataSource: any, pagination: any) => {
                if (appKey !== 'ke' || pageKey !== 'sub1' || tableKey !== 'sub1Table') return; 
                console.log('sub1Table--afterTableDataSourceFetched:', columns, dataSource, pagination)

        })
        hooks.afterPageLoaded.tap(
            'Sub1List--afterEntryLoaded',
            (appKey: string, pageKey: string, pageJson: any) => {
                if (appKey !== 'ke' || pageKey !== 'sub1') return;
            },
        );
        hooks.afterPageUnloaded.tap(
            'Sub1List--afterEntryUnloaded',
            (appKey: string, pageKey: string, pageJson: any) => {
                if (appKey !== 'ke' || pageKey !== 'sub1') return;
            },
        );
        
        hooks.afterComponentUnloaded.tap(
            'Sub1List--afterComponentUnloaded',
            (
                appKey: string,
                pageKey: string,
                component: string,
                componentKey: string,
                props: any,
            ) => {
            },
        );
    }
}
