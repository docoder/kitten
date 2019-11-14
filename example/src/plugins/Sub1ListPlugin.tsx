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
        hooks.afterComponentLoaded.tap(
            'Sub1List--afterComponentLoaded',
            (
                appKey: string,
                pageKey: string,
                component: string,
                componentKey: string,
                props: any,
            ) => {
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
