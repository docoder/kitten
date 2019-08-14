export function getValueByKeypath(modal: any, keypath:string) {
    const keys = keypath.split('.').map(s => s.trim()).filter(s => s)
    let value = modal
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        value = value[key]
    }
    return value
}