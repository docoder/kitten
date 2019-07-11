declare interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray;
}
declare interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }
