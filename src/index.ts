import {Handle, Listener, Subscription, Type} from './type';

interface Node {
    [event: string]: Subscription[]
}

let listener: Listener;

const rootNode: Node = {};

export let defaultSeperator = '$';

export let innerEventType = '_##_inner_##_event_##_type_##_';

function checkInit() {
    if (!listener) {
        throw new Error('@hecom/listener hasn\'t init, you must call init function first')
    }
}

export function init({adapter}: { adapter: Listener }) {
    listener = adapter;
}

export function register(type: Type, func: Handle) {
    return registerEvent(normalEventName(type), func);
}

export function registerWithSubEvent(type: Type, func: Handle) {
    return registerEvent(recursiveEventName(type), func);
}

function registerEvent(eventName: string, func: Handle) {
    checkInit();
    const listenerObj = listener.register(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
    }
    return listenerObj;
}

export function unregister(type: Type, listenerObj?: Subscription) {
    checkInit();
    const eventName = normalEventName(type);
    const rEventName = recursiveEventName(type);
    if (listenerObj) {
        if (rootNode[eventName]) {
            rootNode[eventName] = rootNode[eventName].filter(item => item !== listenerObj);
            if (rootNode[eventName].length == 0) {
                delete rootNode[eventName];
            }
        }
        if (rootNode[rEventName]) {
            rootNode[rEventName] = rootNode[rEventName].filter(item => item !== listenerObj);
            if (rootNode[rEventName].length == 0) {
                delete rootNode[rEventName];
            }
        }
        listenerObj.remove();
    } else {
        if (rootNode[eventName]) {
            rootNode[eventName].forEach(obj => obj.remove());
            delete rootNode[eventName];
        }
        if (rootNode[rEventName]) {
            rootNode[rEventName].forEach(obj => obj.remove());
            delete rootNode[rEventName];
        }
    }
}

export function trigger(type: Type, state?: any) {
    checkInit();
    const newState = Object.prototype.isPrototypeOf(state) ? {...state, [innerEventType]: type} : state;
    const eventName = normalEventName(type);
    listener.trigger(eventName, newState);
    const upperType = Array.isArray(type) ? [...type] : [type];
    while (upperType.length > 0) {
        const upperEventName = recursiveEventName(upperType);
        if (rootNode[upperEventName]) {
            listener.trigger(upperEventName, newState);
        }
        upperType.pop();
    }
}

function recursiveEventName(type: Type) {
    const globalHeader = ['&#@!$%%$!@#&', '1234567890987654321'];
    const types = Array.isArray(type) ? type : [type];
    return [...globalHeader, ...types].join(defaultSeperator);
}

function normalEventName(type: Type) {
    if (Array.isArray(type)) {
        return type.join(defaultSeperator);
    } else if (typeof type === 'string') {
        return type;
    } else {
        return JSON.stringify(type);
    }
}

export default {
    init, trigger, register, registerWithSubEvent, unregister
}