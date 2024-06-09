import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
    }
});

// auth routes
export const signup = (data) => {
    return api.post('/api/auth/signup', data);
}
export const login = (data) => {
    return api.post('/api/auth/login', data);
}
export const loginAdmin = () => {
    return api.get('/api/user/admin-auth');
}
export const loginUser = () => {
    return api.get('/api/user/user-auth');
}
export const logout = async () => {
    return await api.get('/api/auth / logout');
}


//user route 
export const deleteUser = async (userId) => {
    return await api.delete(`/api/user/delete/${userId}`);
}
export const updateProfilePicture = async (data) => {
    const { userId, formData } = data;
    console.log("user profile photo", data);
    return api.post(`/api/user/update-profile-photo/${userId}`, formData)
}

export const updateAdmin = async (data) => {
    const { userId, formData } = data;
    console.log(data);
    return api.post(`/api/user/update/${userId}`, formData)
}
export const updateAdminPassword = async (data) => {
    const { userId, updatePassword } = { data };
    return api.post(`/api/user/update-password/${userId}`, updatePassword)
}

//packages route
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

export const createPackage = async (formData) => {
    return await api.post('/api/package/create-package', formData);
}
export const updatePackage = async (data) => {
    const { packageId, formData } = data;
    return api.post(`/api/package/update-package/${packageId}`, formData)
}
//rating routes
export const getRatings = async (id, someParam) => {
    const res = await api.get(`/api/rating/get-ratings/${id}/${someParam}`);
    return res;
}

export const getAverageRating = async (id) => {
    const res = await api.get(`/api/rating/average-rating/${id}`);
    return res;
}


// booking routes
export const getCurrentBookings = async (searchTerm) => {
    return api.get(`/api/booking/get-currentBookings?searchTerm=${searchTerm}`);
}
export const cancelBooking = (data) => {
    const { bookingId, userId } = data;
    return api.post(`/api/booking/cancel-booking/${bookingId}/${userId}`)
}
export default api;