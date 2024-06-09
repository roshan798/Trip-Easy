import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
    }
});

export const signup = (data) => {
    return api.post('/api/auth/signup', data);
}

export const login = (data) => {
    return api.post('/api/auth/login', data);
}

export const getPackage = (params) => {
    return api.get(`/api/package/get-package-data/${params?.id}`);
}

export const getPackages = (queryParams) => {
    const { searchQuery = '', sortBy = 'packageRating', limit = 8, offer = false } = queryParams;
    let url = '/api/package/get-packages?';
    if (searchQuery) {
        url += `${searchQuery}&`;
    }
    if (sortBy || limit || offer) {
        url += `sort=${sortBy}&limit=${limit}&offer=${offer}`;
    }
    return api.get(url);
}

export const getRatings = async (id, someParam) => {
    const res = await api.get(`/api/rating/get-ratings/${id}/${someParam}`);
    return res;
}

export const getAverageRating = async (id) => {
    const res = await api.get(`/api/rating/average-rating/${id}`);
    return res;
}

export default api;