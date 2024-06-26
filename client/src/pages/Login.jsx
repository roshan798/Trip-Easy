import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    // loginFailure,
    // loginStart,
    loginSuccess,
} from "../redux/user/userSlice.js"; // remove from the slic too
import { login } from "../http/index.js";
import { useNotification } from "../hooks/useNotification.js";
import { useDispatch } from "react-redux";

const Login = () => {
    const showNotification = useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const defaultFormData = {
        email: "",
        password: "",
    };
    const [formData, setFormData] = useState(defaultFormData);
    const [loginState, setLoginState] = useState({
        loading: false,
        error: null,
    }); // may use later
    const { error, loading } = loginState;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoginState({ ...loginState, loading: true });
            const { data } = await login(formData);
            if (data?.success) {
                showNotification(data?.message, "success");
                dispatch(loginSuccess(data?.user));
                navigate("/");
            } else {
                showNotification(data?.message, "error");
            }
        } catch (error) {
            showNotification(
                error?.response?.data?.message || error?.message,
                "error"
            );
            console.log(error);
        } finally {
            setFormData(defaultFormData);
            setLoginState({ ...loginState, loading: false });
        }
    };

    return (
        <div
            className="flex items-center justify-center"
            style={{
                width: "100%",
                height: "calc(100vh - 4rem)",
                background:
                    "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
            }}>
            <form
                onSubmit={handleSubmit}
                className="relative bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
                <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-800">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        required
                        value={formData.email}
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-800">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </button>
                <p className="text-sm text-blue-700 mt-4 text-center hover:underline">
                    <Link to="/signup">Don't have an account? Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
