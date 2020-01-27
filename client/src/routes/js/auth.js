export const isAuthenticated = () => {

    let auth = localStorage.getItem('auth');

    if (!auth) return false;
    else if (typeof auth != 'string') return false;

    return true;
};