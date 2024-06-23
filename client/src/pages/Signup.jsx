import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../http";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });
    // console.log(formData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await signup(formData);
            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/login");
            } else {
                alert(res?.data?.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen relative"
            style={{
                width: "100%",
                background:
                    "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
            }}>
            <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm"></div>
            <form
                onSubmit={handleSubmit}
                className="relative bg-white p-6 my-4 rounded-lg shadow-lg w-80 sm:w-96">
                <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700">
                        Username<span className="text-red-700">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700">
                        Email<span className="text-red-700">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700">
                        Password<span className="text-red-700">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700">
                        Address<span className="text-red-700">*</span>
                    </label>
                    <textarea
                        maxLength={200}
                        id="address"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700">
                        Phone<span className="text-red-700">*</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Signup
                </button>
                <p className="text-sm text-blue-700 mt-4 text-center hover:underline">
                    <Link to="/login">Have an account? Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
