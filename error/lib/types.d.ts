export interface CyberErrorOptions {
    name?: string,
    type?: string,
    data?: Object,
    error?: Error,
    retry?: boolean,
    message?: string
}

export as namespace types;