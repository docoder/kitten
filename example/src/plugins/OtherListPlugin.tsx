import React from 'react'
import { Plugin, AppHooks, TableColumn } from 'kittenjs'
export default class OtherListPlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.beforeTableColumnFinalization.tap('OtherList--beforeTableColumnFinalization', (appkey: string, pageKey: string, tableKey:string, props: any, column: TableColumn) => {
            if (pageKey !== 'other' || tableKey !== 'otherTable') return;
            if(column.key === 'number') {
                column.editable = (record: any) => {
                    return record.id % 2 !== 0
                }
            }
        })
    }
}
