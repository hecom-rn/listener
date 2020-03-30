export type Handle = (param?: any) => void

export type Type = string | string[]

export interface Subscription {
    remove: () => void
}

export interface Listener {
    trigger: (event: string, param?: any) => void
    register: (event: string, handle: Handle) => Subscription
    unRegister: (obj: Subscription) => void
}