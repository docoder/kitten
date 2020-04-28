
import React from 'react';
import { Plugin, AppHooks } from 'kittenjs'

export default class TableCellCommonPlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.beforeTableColumnFinalization.tap(
            'TableCellCommonPlugin--beforeTableColumnFinalization',
            (appKey: string, pageKey: string, tableKey: string, props: any, column: any) => {
                if (column && column.meta && column.meta.format && column.meta.format === 'text$:multiLine') {
                    column.render = (text: string, record: any) => {
                        const value = record[column.key]
                        
                        if (value && typeof value === 'string' && value.includes('\r\n')) {
                            const items = value.split('\r\n')
                            return items.map((i: any, index: number) => (
                                <div key={index}>{i}</div>
                            ));
                        }
                    };
                }
            },
        );
    }
}