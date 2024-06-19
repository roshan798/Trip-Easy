import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <>
            <div className="flex items-center justify-between bg-slate-400 p-4">
                <Link
                    to="/"
                    className="relative h-min text-4xl font-bold"
                    style={{
                        color: "transparent",
                        WebkitTextStroke: "0.7px",
                        WebkitTextStrokeColor: "#fff",
                    }}>
                    Come
                    <span
                        className="absolute left-1 top-[-10px] rounded-lg text-center text-2xl text-slate-700 shadow-xl"
                        style={{
                            WebkitTextStroke: "0",
                        }}>
                        Dream Tours
                    </span>
                </Link>
                <ul className="flex list-none flex-wrap items-center justify-end gap-2 font-semibold text-white">
                    <li className="transition-all duration-150 hover:scale-105 hover:underline">
                        <Link to={`/`}>Home</Link>
                    </li>
                    <li className="transition-all duration-150 hover:scale-105 hover:underline">
                        <Link to={`/search`}>Packages</Link>
                    </li>
                    {/* <li className="transition-all duration-150 hover:scale-105 hover:underline">
                        <Link to={`/about`}>About</Link>
                    </li> */}
                    <li className="flex h-10 w-10 items-center justify-center">
                        {currentUser ? (
                            <Link
                                to={`/profile/${
                                    currentUser.user_role === 1
                                        ? "admin"
                                        : "user"
                                }`}>
                                <img
                                    src={
                                        currentUser.avatar || defaultProfileImg
                                    }
                                    alt={currentUser.username}
                                    className="h-10 w-10 rounded-[50%] border border-black"
                                />
                            </Link>
                        ) : (
                            <Link to={`/login`}>Login</Link>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Header;
