import axios from 'axios'
import { apiOptions } from './index'

export async function login(username, password) {
    const { data } = await axios.post('login', { username, password }, apiOptions)
    return data
}

export async function verifyToken(token) {

    const { data } = await axios.post('verifytoken', { token }, apiOptions)
    return data
}