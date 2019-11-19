import React from 'react';
import { Plugin, AppHooks, } from 'kittenjs'

export default class GlobalCustomPlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.renderSiderTopSection.tap('OtherList--renderSiderTopSection', (appkey: string) => {
            return (
                <div style={{ 
                    padding: 20,
                    paddingTop: 30,
                    paddingLeft: 32,
                    color: 'white',
                    fontSize: 12,
                    lineHeight: 1.5
                }}>
                    <div>哈哈</div>
                    <div>欢迎欢迎</div>
                </div>
            )
        })
    }
}