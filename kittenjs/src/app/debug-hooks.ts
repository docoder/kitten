export function debugHooks(obj: any, includes: string[]): any {
    return new Proxy(obj, {
        get: function(target: any, name: string, receiver: any) {
            if (
                name === 'tap' &&
                target[name] &&
                typeof target[name] === 'function'
            ) {
                return function(option: string, func: Function) {
                    const newF = function (...rest: any[]) {
                        const methodName = option;
                        console.group(methodName);
                        console.log(...rest);
                        console.groupEnd();
                        return func(...rest);
                    }
                    return target[name](option, newF);
                };
            } else if (
                target[name] !== null &&
                typeof target[name] === 'object' &&
                includes.includes(name)
            ) {
                return debugHooks(target[name], includes);
            } else {
                return Reflect.get(target, name, receiver);
            }
        },
    });
}