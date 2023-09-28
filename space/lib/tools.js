const isObject = (value) => {
    return value !== null && value.constructor === Object;
};

const recurseProxify = (input) => {
    if (!isObject)
        return input;

    return new Proxy(input, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, target);
            return recurseProxify(value);
        },
        set() {
            throw Error('Cannot modify immutable object');
        },
        deleteProperty() {
            throw Error('Cannot delete property of immutable object');
        }
    });
}

export { isObject, recurseProxify }