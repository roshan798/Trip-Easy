import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    logOutStart,
    logOutSuccess,
    logOutFailure,
    deleteUserAccountStart,
    deleteUserAccountSuccess,
    deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import { deleteUser, logout, updateProfilePicture } from "../../http";
import { useNotification } from "../../hooks/useNotification";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [profilePhoto, setProfilePhoto] = useState(undefined);
    const [photoPercentage, setPhotoPercentage] = useState(0);
    const [activePanelId, setActivePanelId] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        address: "",
        phone: "",
        avatar: "",
    });

    useEffect(() => {
        if (currentUser !== null) {
            setFormData({
                ...currentUser,
            });
        }
    }, [currentUser]);

    const notify = useNotification();

    const handleProfilePhoto = (photo) => {
        try {
            dispatch(updateUserStart());
            const storage = getStorage(app);
            const photoname =
                new Date().getTime() + photo.name.replace(/\s/g, "");
            const storageRef = ref(storage, `profile-photos/${photoname}`); //profile-photos - folder name in firebase
            const uploadTask = uploadBytesResumable(storageRef, photo);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.floor(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setPhotoPercentage(progress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadUrl) => {
                            const { data } = await updateProfilePicture({
                                userId: currentUser._id,
                                formData: {
                                    avatar: downloadUrl,
                                },
                            });
                            if (data?.success) {
                                notify(data?.message, "success");
                                setFormData({
                                    ...formData,
                                    avatar: downloadUrl,
                                });
                                dispatch(updateUserSuccess(data?.user));
                                setProfilePhoto(null);
                                return;
                            } else {
                                dispatch(updateUserFailure(data?.message));
                                notify(data?.message, "error");
                            }
                        }
                    );
                }
            );
        } catch (error) {
            console.error("error", error.message);
            console.log(error);
        }
    };

    const handleLogout = async () => {
        try {
            dispatch(logOutStart());
            const { data } = await logout();
            if (data?.success !== true) {
                dispatch(logOutFailure(data?.message));
                notify(data?.message, "error");
                return;
            }
            dispatch(logOutSuccess());
            navigate("/login");
            notify(data?.message, "success");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        const CONFIRM = window.confirm(
            "Are you sure ? the account will be permanently deleted!"
        );
        if (CONFIRM) {
            try {
                dispatch(deleteUserAccountStart());
                const { data } = await deleteUser(currentUser._id);
                if (data?.success === false) {
                    dispatch(deleteUserAccountFailure(data?.message));
                    notify("Something went wrong!", "error");
                    return;
                }
                dispatch(deleteUserAccountSuccess());
                notify(data?.message, "success");
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    return (
        <div className="flex w-full flex-wrap p-2 max-sm:flex-col">
            {currentUser ? (
                <>
                    <div className="w-[35%] p-3 max-sm:w-full">
                        <div className="flex flex-col items-center gap-4 p-3">
                            <div className="relative flex w-full flex-col items-center ">
                                <img
                                    src={
                                        (profilePhoto &&
                                            URL.createObjectURL(
                                                profilePhoto
                                            )) ||
                                        formData.avatar
                                    }
                                    alt="Profile photo"
                                    className="p-1 max-h-64 min-h-52 w-64 aspect-square border-2 border-blue-600 rounded-full"
                                    onClick={() => fileRef.current.click()}
                                    onMouseOver={() => {
                                        document
                                            .getElementById("photoLabel")
                                            .classList.add("block");
                                    }}
                                    onMouseOut={() => {
                                        document
                                            .getElementById("photoLabel")
                                            .classList.remove("block");
                                    }}
                                />
                                <input
                                    type="file"
                                    name="photo"
                                    id="photo"
                                    hidden
                                    ref={fileRef}
                                    accept="image/*"
                                    onChange={(e) =>
                                        setProfilePhoto(e.target.files[0])
                                    }
                                />
                                <label
                                    htmlFor="photo"
                                    id="photoLabel"
                                    className="absolute bottom-0 w-64 rounded-b-lg bg-slate-300 p-2 text-center text-lg font-semibold text-white"
                                    hidden>
                                    Choose Photo
                                </label>
                            </div>
                            {profilePhoto && (
                                <div className="flex w-full justify-between gap-1">
                                    <button
                                        onClick={() =>
                                            handleProfilePhoto(profilePhoto)
                                        }
                                        className="mt-3 flex-1 bg-green-700 p-2 text-white hover:opacity-90">
                                        {loading
                                            ? `Uploading...(${photoPercentage}%)`
                                            : "Upload"}
                                    </button>
                                </div>
                            )}
                            <p
                                style={{
                                    width: "100%",
                                    borderBottom: "1px solid black",
                                    lineHeight: "0.1em",
                                    margin: "10px",
                                }}>
                                <span
                                    className="font-semibold"
                                    style={{ background: "#fff" }}>
                                    Details
                                </span>
                            </p>
                            <div className="flex w-full justify-between px-1 *:px-4 *:py-2 gap-3 ">
                                <button
                                    onClick={handleLogout}
                                    className="self-start w-full   rounded-lg border border-red-600  text-lg font-semibold text-red-600 hover:bg-red-600 hover:text-white">
                                    Log-out
                                </button>
                                <button
                                    onClick={() => setActivePanelId(8)}
                                    className="self-end  w-full rounded-lg bg-gray-500 font-semibold  text-lg text-white hover:bg-gray-700">
                                    Edit Profile
                                </button>
                            </div>
                            <div className="w-full break-all rounded-lg bg-white p-6 shadow-2xl">
                                <p className="text-3xl font-semibold text-gray-800">
                                    <span className=" text-gray-700">Hi </span>
                                    {currentUser.username}!
                                </p>
                                <p className="mt-2 text-lg font-semibold text-gray-700">
                                    Email:{" "}
                                    <span className="font-normal text-gray-600">
                                        {currentUser.email}
                                    </span>
                                </p>
                                <p className="mt-2 text-lg font-semibold text-gray-700">
                                    Phone:{" "}
                                    <span className="font-normal text-gray-600">
                                        {currentUser.phone}
                                    </span>
                                </p>
                                <p className="mt-2 text-lg font-semibold text-gray-700">
                                    Address:{" "}
                                    <span className="font-normal text-gray-600">
                                        {currentUser.address}
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={handleDeleteAccount}
                                className="text-red-600 hover:underline border hover:bg-red-600 transition-colors duration-500 hover:text-white border-red-600 p-2 w-full rounded-md bg-red-600/20">
                                Delete account
                            </button>
                        </div>
                    </div>
                    {/* ---------------------------------------------------------------------------------------- */}
                    <div className="w-[65%] max-sm:w-full">
                        <div className="main-div">
                            <nav className="navbar w-full overflow-x-auto border-b-4 border-blue-500">
                                <div className="flex w-full gap-2 hover:*:bg-blue-500">
                                    <button
                                        className={
                                            activePanelId === 1
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(1)}>
                                        Bookings
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 2
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(2)}>
                                        Add Packages
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 3
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(3)}>
                                        All Packages
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 4
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(4)}>
                                        Users
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 5
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(5)}>
                                        Payments
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 6
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(6)}>
                                        Ratings/Reviews
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 7
                                                ? "text-nowrap rounded-t bg-blue-500 p-1 text-white transition-all duration-300"
                                                : "text-nowrap rounded-t p-1 transition-all duration-300"
                                        }
                                        id="bookings"
                                        onClick={() => setActivePanelId(7)}>
                                        History
                                    </button>
                                    {/* <button
                    className={
                      activePanelId === 7
                        ? "p-1 rounded-t transition-all duration-300 text-nowrap bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300 text-nowrap"
                    }
                    id="updateProfile"
                    onClick={() => setActivePanelId(7)}
                  >
                    Update Profile
                  </button> */}
                                </div>
                            </nav>
                            <div className="content-div flex flex-wrap">
                                {activePanelId === 1 ? (
                                    <AllBookings />
                                ) : activePanelId === 2 ? (
                                    <AddPackages />
                                ) : activePanelId === 3 ? (
                                    <AllPackages />
                                ) : activePanelId === 4 ? (
                                    <AllUsers />
                                ) : activePanelId === 5 ? (
                                    <Payments />
                                ) : activePanelId === 6 ? (
                                    <RatingsReviews />
                                ) : activePanelId === 7 ? (
                                    <History />
                                ) : activePanelId === 8 ? (
                                    <AdminUpdateProfile />
                                ) : (
                                    <div>Page Not Found!</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <p className="text-red-700">Login First</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
