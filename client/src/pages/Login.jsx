import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../http/index.js";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            dispatch(loginStart());
            const {data} = await login(formData);
            if (data?.success) {
                dispatch(loginSuccess(data?.user));
                alert(data?.message);
                navigate("/");
            } else {
                dispatch(loginFailure(data?.message));
                alert(data?.message);
            }
        } catch (error) {
            dispatch(loginFailure(error.message));
            console.log(error);
        }
    };

    return (
        <div
            className="flex items-center justify-center"
            style={{
                width: "100%",
                height: "90vh",
                background:
                    "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
            }}>
            <form onSubmit={handleSubmit}>
                <div className="flex h-fit w-72 flex-col gap-5 rounded-lg border border-black bg-white bg-opacity-60 p-4 sm:w-[320px]">
                    <h1 className="text-center text-3xl font-semibold">
                        Login
                    </h1>
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="font-semibold">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="rounded border border-black bg-white bg-opacity-80 p-3"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="font-semibold">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="rounded border border-black bg-white bg-opacity-80 p-3"
                            onChange={handleChange}
                        />
                    </div>
                    <p className="text-sm text-blue-700 hover:underline">
                        <Link to={`/signup`}>Dont have an account? Signup</Link>
                    </p>
                    <button
                        disabled={loading}
                        className="rounded bg-slate-700 p-3 text-white hover:opacity-95">
                        {loading ? "Loading..." : "Login"}
                    </button>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            </form>
        </div>
    );
};

export default Login;
