export function Store(data) {
    return {
        type: 'STORE',
        payload: data
    }
}

export function Select(data) {
    return {
        type: 'SELECT',
        payload: data
    }
}