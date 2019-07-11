import { AppHooks } from '../app'
export default interface Plugin {
    apply(hooks: AppHooks): void 
}
