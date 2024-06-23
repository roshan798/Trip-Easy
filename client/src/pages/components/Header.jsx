import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";
import { useLocation } from "react-router-dom";
const Header = () => {
    const location = useLocation();
    const { pathname } = location;
    const { currentUser } = useSelector((state) => state.user);
    return (
        <>
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2">
                <Link
                    to="/"
                    className="">
                    <img
                        src="/images/logo1.png"
                        id="logo-image"
                        alt="trip easy logo"
                        className="object-cover h-12 w-48"
                    />
                </Link>

                <ul className="flex list-none flex-wrap items-center justify-end gap-4 font-semibold text-white">
                    <li className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/50 cursor-pointer rounded transition-all *:text-black duration-150 hover:scale-105 hover:underline text-black">
                        <Link to={`/`}>Home</Link>
                    </li>
                    <li className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/50 cursor-pointer rounded transition-all duration-150 hover:scale-105 hover:underline text-black">
                        <Link to={`/search`}>Packages</Link>
                    </li>
                    {currentUser ? (
                        <>
                            <li className="ml-3 flex h-10 w-10 items-center justify-center">
                                <Link
                                    to={`/profile/${
                                        currentUser.user_role === 1
                                            ? "admin"
                                            : "user"
                                    }`}>
                                    <img
                                        src={
                                            currentUser.avatar ||
                                            defaultProfileImg
                                        }
                                        alt={currentUser.username}
                                        className="h-10 w-10 rounded-[50%] border border-black"
                                    />
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/50 cursor-pointer rounded transition-all duration-150 hover:scale-105 hover:underline text-black">
                                {pathname === "/login" ? (
                                    <Link to={`/signup`}>Signup</Link>
                                ) : (
                                    <Link to={`/login`}>Login</Link>
                                )}
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Header;
