import { AppHooks } from '../app'
export interface Plugin {
    apply(hooks: AppHooks): void 
}
