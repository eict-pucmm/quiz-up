const getUser = () => {
    return localStorage.getItem("USER")
}

const saveUser = (user) => {
    const { error } = localStorage.setItem("USER", user)
    return error ? 
    {data: null, error: error} :
    {data: 'saved user', error: null}
}

export { getUser , saveUser }