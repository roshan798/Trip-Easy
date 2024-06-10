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

/**
 * Sign up a new user.
 * @param {Object} data - The signup data containing user information.
 * @returns {Promise} - Axios response promise.
 */
export const signup = (data) => {
    return api.post('/api/auth/signup', data);
}

/**
 * Log in an existing user.
 * @param {Object} data - The login data containing user credentials.
 * @returns {Promise} - Axios response promise.
 */
export const login = (data) => {
    return api.post('/api/auth/login', data);
}

/**
 * Check if the admin is authenticated.
 * @returns {Promise} - Axios response promise.
 */
export const loginAdmin = () => {
    return api.get('/api/user/admin-auth');
}

/**
 * Check if the user is authenticated.
 * @returns {Promise} - Axios response promise.
 */
export const loginUser = () => {
    return api.get('/api/user/user-auth');
}

/**
 * Log out the current user.
 * @returns {Promise} - Axios response promise.
 */
export const logout = async () => {
    return await api.get('/api/auth/logout');
}

// user routes

/**
 * Delete a user by userId.
 * @param {String} userId - The ID of the user to delete.
 * @returns {Promise} - Axios response promise.
 */
export const deleteUser = async (userId) => {
    return await api.delete(`/api/user/delete/${userId}`);
}

/**
 * Update a user's profile picture.
 * @param {Object} data - An object containing userId and formData.
 * @returns {Promise} - Axios response promise.
 */
export const updateProfilePicture = async (data) => {
    const { userId, formData } = data;
    console.log("user profile photo", data);
    return api.post(`/api/user/update-profile-photo/${userId}`, formData);
}

/**
 * Update admin user information.
 * @param {Object} data - An object containing userId and formData.
 * @returns {Promise} - Axios response promise.
 */
export const updateAdmin = async (data) => {
    const { userId, formData } = data;
    console.log(data);
    return api.post(`/api/user/update/${userId}`, formData);
}

/**
 * Update admin user password.
 * @param {Object} data - An object containing userId and updatePassword object.
 * @returns {Promise} - Axios response promise.
 */
export const updateAdminPassword = async (data) => {
    const { userId, updatePassword } = data;
    return api.post(`/api/user/update-password/${userId}`, updatePassword);
}

export const getAllUsers = (queryParams) => {
    const { searchQuery } = queryParams;
    let url = "/api/user/getAllUsers?searchTerm"
    if (searchQuery) {
        url = url.concat(searchQuery)
    }
    return api.get(url);
}

// package routes

/**
 * Get a specific package by ID.
 * @param {Object} params - An object containing the package ID.
 * @returns {Promise} - Axios response promise.
 */
export const getPackage = (params) => {
    return api.get(`/api/package/get-package-data/${params?.id}`);
}

/**
 * Get a list of packages based on query parameters.
 * @param {Object} queryParams - An object containing searchQuery, sortBy, limit, offer, and startIndex.
 * @returns {Promise} - Axios response promise.
 */
export const getPackages = (queryParams) => {
    const { searchQuery = '', sortBy = 'packageRating', limit = 8, offer = false, startIndex = 0 } = queryParams;
    let url = '/api/package/get-packages?';
    if (searchQuery) {
        url += `${searchQuery}&`;
    }
    if (sortBy || limit || offer || startIndex) {
        url += `sort=${sortBy}&limit=${limit}&offer=${offer}&startIndex=${startIndex}`;
    }
    return api.get(url);
}

/**
 * Create a new package.
 * @param {Object} formData - The form data containing package information.
 * @returns {Promise} - Axios response promise.
 */
export const createPackage = async (formData) => {
    return await api.post('/api/package/create-package', formData);
}

/**
 * Update an existing package.
 * @param {Object} data - An object containing packageId and formData.
 * @returns {Promise} - Axios response promise.
 */
export const updatePackage = async (data) => {
    const { packageId, formData } = data;
    return api.post(`/api/package/update-package/${packageId}`, formData);
}

/**
 * Delete a package by packageId.
 * @param {String} packageId - The ID of the package to delete.
 * @returns {Promise} - Axios response promise.
 */
export const deletePackage = async (packageId) => {
    return api.delete(`/api/package/delete-package/${packageId}`);
}

// rating routes

/**
 * Get ratings for a specific package by ID.
 * @param {String} id - The ID of the package.
 * @param {String} someParam - An additional parameter for the request.
 * @returns {Promise} - Axios response promise.
 */
export const getRatings = async (data) => {
    const { packageId, serachQuery } = data;
    return await api.get(`/api/rating/get-ratings/${packageId}/${serachQuery}`);
}

/**
 * Get the average rating for a specific package by ID.
 * @param {String} id - The ID of the package.
 * @returns {Promise} - Axios response promise.
 */
export const getAverageRating = async (packageId) => {
    return await api.get(`/api/rating/average-rating/${packageId}`);
}

// booking routes

/**
 * Get current bookings based on a search term.
 * @param {String} searchTerm - The search term to filter bookings.
 * @returns {Promise} - Axios response promise.
 */
export const getCurrentBookings = async (searchTerm) => {
    return api.get(`/api/booking/get-currentBookings?searchTerm=${searchTerm}`);
}

/**
 * Cancel a booking by bookingId and userId.
 * @param {Object} data - An object containing bookingId and userId.
 * @returns {Promise} - Axios response promise.
 */
export const cancelBooking = (data) => {
    const { bookingId, userId } = data;
    return api.post(`/api/booking/cancel-booking/${bookingId}/${userId}`);
}

export const getAllBookings = (queryParams) => {
    const { searchQuery = '', sortBy = 'packageRating', limit = 8, offer = false, startIndex = 0 } = queryParams;
    let url = '/api/booking/get-allBookings';
    if (searchQuery) {
        url += `${searchQuery}&`;
    }
    if (sortBy || limit || offer || startIndex) {
        url += `sort=${sortBy}&limit=${limit}&offer=${offer}&startIndex=${startIndex}`;
    }
    return api.get(url);
}
export const deleteHistory = (queryParams) => {
    const { id, userId } = queryParams;
    return api.delete(`/api/booking/delete-booking-history/${id}/${userId}`);
}
export default api;
