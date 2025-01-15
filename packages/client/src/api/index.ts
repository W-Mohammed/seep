let _CLIENT_HOST 
if (import.meta.env.DEV) {
  _CLIENT_HOST = 'http://localhost:5173'
} else if (import.meta.env.CLIENT_HOST) {
  _CLIENT_HOST = import.meta.env.CLIENT_HOST
} else {

    throw new Error('In production, CLIENT_HOST must be provided')
}

export const CLIENT_HOST = _CLIENT_HOST


let _NODE_HOST
if (import.meta.env.DEV) {
  _NODE_HOST = 'http://localhost:3000'
} else if (import.meta.env.NODE_HOST) {
  _NODE_HOST = import.meta.env.NODE_HOST
} else {
    throw new Error('In production, NODE_HOST must be provided')
}

export const NODE_HOST = _NODE_HOST


export const apiOptions = {
  baseURL: NODE_HOST,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  }
}

export const apiOptionsWithAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  return {
    baseURL: NODE_HOST,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
}
