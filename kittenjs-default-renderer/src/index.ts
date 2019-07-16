import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import {isUnitlessProperty} from './utils/css';
import {debugMethods} from './utils/debug-methods';
import {
    createTable,
    createForm,
    createLayout,
    updateTable,
    updateForm,
    updateLayout,
    createAlert,
    updateAlert,
    createLoading,
    updateLoading,
    createButton,
    updateButton,
    createModal,
    updateModal
} from './ui';
const { unstable_cancelCallback, unstable_scheduleCallback }  = require('scheduler');

declare type Type = string;
declare type Props = {[propName: string]: any};
declare interface Container {
    appendChild(child: HydratableInstance): void;
    removeChild(child: HydratableInstance): void;
    insertBefore(child: HydratableInstance, beforeChild: HydratableInstance): void;
    children: Array<Instance | TextInstance>;
    createNodeMock: ({ type, props }: { type: Type, props: Props }) => PublicInstance;
    tag: 'CONTAINER';
}
// export interface Instance {
//     appendChild(child: HydratableInstance): void;
//     removeChild(child: HydratableInstance): void;
//     insertBefore(child: HydratableInstance, beforeChild: HydratableInstance): void;
//     setAttribute(propName: any, arg1: any): void;
//     addEventListener(eventName: any, arg1: any): void;
//     removeEventListener(eventName: any, arg1: any): void;
//     removeAttribute(propName: any): void;
//     focus(): void;
//     textContent: string;
//     type: string;
//     props: object;
//     children: Array<Instance | TextInstance>;
//     rootContainerInstance: Container;
//     tag: 'INSTANCE';
//     style: {[propsName: string]: any}
// }
declare type Instance = HTMLElement
declare type TextInstance = HTMLElement
// declare interface TextInstance {
//     nodeValue: string;
//     text: string;
//     tag: 'TEXT';
// }
declare type HydratableInstance = Instance | TextInstance;
declare type PublicInstance = Instance | TextInstance;
declare type HostContext = object;
declare type UpdatePayload = any;
declare type ChildSet = undefined; // Unused
declare type TimeoutHandle = any;
declare type NoTimeout = -1;

interface Deadline {
    timeRemaining: () => number;
    didTimeout: boolean;
}
interface HostConfig extends Reconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> {
    schedulePassiveEffects: any;
    cancelPassiveEffects: any;
}

let scheduledCallback: ((deadline: Deadline) => any) | null = null;

function setStyles(domElement: Instance, styles: Props) {
    if( !styles ) return; 
    Object.keys(styles).forEach(( name ) => {
        const rawValue = styles[name];
        const isEmpty =
            rawValue === null ||
            typeof rawValue === 'boolean' ||
            rawValue === '';

        // Unset the style to its default values using an empty string
        if (isEmpty) domElement.style[name as any] = '';
        else {
            const value =
                typeof rawValue === 'number' && !isUnitlessProperty(name)
                    ? `${rawValue}px`
                    : rawValue;

            domElement.style[name as any] = value;
        }
    });
}

function shallowDiff(oldObj: {[propName: string]: any}, newObj: {[propName: string]: any}) {
    // Return a diff between the new and the old object
    const uniqueProps = new Set([
        ...Object.keys(oldObj),
        ...Object.keys(newObj),
    ]);
    const changedProps = Array.from(uniqueProps).filter(
        propName => oldObj[propName] !== newObj[propName],
    );

    return changedProps;
}

function isUppercase(letter: string) {
    return /[A-Z]/.test(letter);
}

function isEventName(propName: string) {
    return (
        propName.startsWith('on') &&
        window.hasOwnProperty(propName.toLowerCase())
    );
}

const hostConfig: HostConfig = {
    // appendChild for direct children
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance) {
        parentInstance.appendChild(child);
    },

    // Create the DOMElement, but attributes are set in `finalizeInitialChildren`
    createInstance(
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: Reconciler.OpaqueHandle,
    ): Instance | any {
        let domElement = null;
        switch (type) {
            case 'k_layout':
                domElement = document.createElement('div');
                createLayout(domElement, props);
                break;
            case 'k_page':
                domElement = document.createElement('div');
                break;
            case 'k_table':
                domElement = document.createElement('div');
                createTable(domElement, props);
                break;
            case 'k_form':
                domElement = document.createElement('div');
                createForm(domElement, props);
                break;
            case 'k_alert':
                domElement = document.createElement('div');
                createAlert(domElement, props);
                break;
            case 'k_loading':
                domElement = document.createElement('div');
                createLoading(domElement, props);
                break;
            case 'k_button':
                domElement = document.createElement('div');
                createButton(domElement, props)
                break;
            case 'k_modal':
                domElement = document.createElement('div')
                createModal(domElement, props)
                break;
            default:
                domElement = document.createElement(type);
        }
        return domElement;
    },

    createTextInstance(text:string, rootContainerInstance: Container, internalInstanceHandle: Reconciler.OpaqueHandle): TextInstance | any {
        // A TextNode instance is returned because literal strings cannot change their value later on update
        return document.createTextNode(text);
    },

    // Actually set the attributes and text content to the domElement and check if
    // it needs focus, which will be eventually set in `commitMount`
    finalizeInitialChildren(domElement:Instance, type: Type, props: Props) {
        // Set the prop to the domElement
        Object.keys(props).forEach((propName: string) => {
            const propValue = props[propName];

            if (propName === 'style') {
                setStyles(domElement, propValue);
            } else if (propName === 'children') {
                // Set the textContent only for literal string or number children, whereas
                // nodes will be appended in `appendChild`
                if (
                    typeof propValue === 'string' ||
                    typeof propValue === 'number'
                ) {
                    domElement.textContent = propValue+'';
                }
            } else if (propName === 'className') {
                domElement.setAttribute('class', propValue);
            } else if (isEventName(propName)) {
                const eventName = propName.toLowerCase().replace('on', '');
                domElement.addEventListener(eventName, propValue);
            } else {
                domElement.setAttribute(propName, propValue);
            }
        });

        // Check if needs focus
        switch (type) {
            case 'button':
            case 'input':
            case 'select':
            case 'textarea':
                return !!props.autoFocus;
        }

        return false;
    },

    // Useful only for testing
    getPublicInstance(inst: Instance | TextInstance) {
        return inst;
    },

    // Commit hooks, useful mainly for react-dom syntethic events
    prepareForCommit() {},
    resetAfterCommit() {},

    // Calculate the updatePayload
    prepareUpdate(domElement: Instance, type: Type, oldProps: Props, newProps: Props) {
        // Return a diff between the new and the old props
        return shallowDiff(oldProps, newProps);
    },

    getRootHostContext(rootInstance: Container): HostContext {
        return emptyObject;
    },
    getChildHostContext(parentHostContext: HostContext, type: Type) {
        return emptyObject;
    },

    shouldSetTextContent(type, props: any) {
        return (
            type === 'textarea' ||
            typeof props.children === 'string' ||
            typeof props.children === 'number'
        );
    },

    now: () => {
        return Date.now()
    },

    supportsMutation: true,

    appendChild(parentInstance: Instance, child: Instance | TextInstance) {
        parentInstance.appendChild(child);
    },

    // appendChild to root container
    appendChildToContainer(parentInstance: Container, child: Instance | TextInstance) {
        parentInstance.appendChild(child);
    },

    removeChild(parentInstance: Instance, child: Instance | TextInstance) {
        parentInstance.removeChild(child);
    },

    removeChildFromContainer(parentInstance: Container, child: Instance | TextInstance) {
        parentInstance.removeChild(child);
    },

    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance) {
        parentInstance.insertBefore(child, beforeChild);
    },

    insertInContainerBefore(parentInstance: Container, child: Instance | TextInstance, beforeChild: Instance | TextInstance) {
        parentInstance.insertBefore(child, beforeChild);
    },

    commitUpdate(
        domElement: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: Reconciler.OpaqueHandle,
    ) {
        let realDom = domElement
        switch (type) {
            case 'k_layout':
                updateLayout(domElement, newProps)
                break;
            case 'k_table':
                updateTable(domElement, newProps)
                break;
            case 'k_form':
                updateForm(domElement, newProps)
                break;
            case 'k_alert':
                updateAlert(domElement, newProps)
                break;
            case 'k_loading':
                updateLoading(domElement, newProps)
                break;
            case 'k_button':
                updateButton(domElement, newProps) 
                break;
            case 'k_modal':
                updateModal(domElement, newProps) 
                break;
        }
        updatePayload.forEach((propName: string) => {
            // children changes is done by the other methods like `commitTextUpdate`
            if (propName === 'children') return;

            if (propName === 'style') {
                // Return a diff between the new and the old styles
                const styleDiffs = shallowDiff(oldProps.style, newProps.style);
                const finalStyles = styleDiffs.reduce((acc: {[propName: string]: any}, styleName: string) => {
                    // Style marked to be unset
                    if (!newProps.style[styleName]) acc[styleName] = '';
                    else acc[styleName] = newProps.style[styleName];

                    return acc;
                }, {});

                setStyles(realDom, finalStyles);
            } else if (
                newProps[propName] ||
                typeof newProps[propName] === 'number'
            ) {
                realDom.setAttribute(propName, newProps[propName]);
            } else {
                if (isEventName(propName)) {
                    const eventName = propName.toLowerCase().replace('on', '');
                    realDom.removeEventListener(
                        eventName,
                        oldProps[propName],
                    );
                } else {
                    realDom.removeAttribute(propName);
                }
            }
        });
    },

    commitMount(domElement, type, newProps, internalInstanceHandle) {
        domElement.focus();
    },

    commitTextUpdate(textInstance, oldText, newText) {
        textInstance.nodeValue = newText;
    },

    resetTextContent(domElement) {
        domElement.textContent = '';
    },
    shouldDeprioritizeSubtree(type: string, props: Props): boolean {
        return false;
    },
    scheduleDeferredCallback(
        callback: (deadline: Deadline) => any,
        options?: { timeout: number },
    ): number {
        scheduledCallback = callback;
        const fakeCallbackId = 0;
        return fakeCallbackId;
    },
    cancelDeferredCallback(timeoutID: number): void {
        scheduledCallback = null;
    },
    schedulePassiveEffects: unstable_scheduleCallback,
    cancelPassiveEffects: unstable_cancelCallback,
    setTimeout: (handler: any) => -1,
    clearTimeout: (handle: number) => { },
    noTimeout: -1,
    isPrimaryRenderer: false,
    supportsHydration: false,
    supportsPersistence: false
};

// const UIRenderer = Reconciler(
//     debugMethods(hostConfig, [
//         'now',
//         'getChildHostContext',
//         'shouldSetTextContent',
//     ]),
// );
const UIRenderer = Reconciler(
    hostConfig,
);
const ReactUI = {
    render(element: Reconciler.ReactNodeList, domContainer: Reconciler.OpaqueRoot | any, callback: () => void | null | undefined) {
        let root = domContainer._reactRootContainer;

        if (!root) {
            // Remove all children of the domContainer
            let rootSibling;
            while ((rootSibling = domContainer.lastChild)) {
                domContainer.removeChild(rootSibling);
            }

            const newRoot = UIRenderer.createContainer(domContainer, false, false);
            root = domContainer._reactRootContainer = newRoot;
        }

        return UIRenderer.updateContainer(element, root, null, callback);
    },
};
export default ReactUI;
