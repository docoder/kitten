import React from 'react';
import { Plugin, AppHooks, TableColumn } from 'kittenjs'
export default class Sub1ListPlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.beforeTableColumnFinalization.tap(
            'Sub1List--beforeTableColumnFinalization',
            (appKey: string, pageKey: string, column: TableColumn) => {
                if (appKey !== 'ke' || pageKey !== 'sub1') return;
                if (column.key === 'number') {
                    column.editable = (record: any) => {
                        return record.id % 2 === 0;
                    };
                }
                if (column.key === 'items') {
                    column.render = (text: string, record: any) => {
                        return (
                            <div>
                                <span style={{color: 'red'}}>{record.id}</span>{' '}
                                - <span>{text}</span>
                            </div>
                        );
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
                props: any,
            ) => {
            },
        );
    }
}
