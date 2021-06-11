export function Auth(token) {
    return {
        type: 'LOGIN',
        payload: token
    }
}

export function Profile(user) {
    return {
        type: 'USER',
        payload: user
    }
}

export function LogoutUser() {
    return {
        type: 'LOGOUT',
    }
}