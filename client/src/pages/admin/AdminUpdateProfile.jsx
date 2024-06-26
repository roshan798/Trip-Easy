import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    updatePassStart,
    updatePassSuccess,
    updatePassFailure,
} from "../../redux/user/userSlice";
import { updateUser, updatePassword as updateAdminPassword } from "../../http";
import { useNotification } from "../../hooks/useNotification.js";

const AdminUpdateProfile = () => {
    const { currentUser, error } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showNotification = useNotification();
    const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
        useState(true);
    const [formData, setFormData] = useState({
        username: "",
        address: "",
        phone: "",
        avatar: "",
    });
    const [updatePassword, setUpdatePassword] = useState({
        oldpassword: "",
        newpassword: "",
    });

    useEffect(() => {
        if (currentUser !== null) {
            setFormData({
                username: currentUser.username,
                address: currentUser.address,
                phone: currentUser.phone,
                avatar: currentUser.avatar,
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handlePass = (e) => {
        setUpdatePassword({
            ...updatePassword,
            [e.target.id]: e.target.value,
        });
    };

    const updateUserDetails = async (e) => {
        e.preventDefault();
        if (
            currentUser.username === formData.username &&
            currentUser.address === formData.address &&
            currentUser.phone === formData.phone
        ) {
            showNotification(
                "Change at least one field to update details",
                "error"
            );
            return;
        }
        try {
            setLoading(true);
            dispatch(updateUserStart());
            const { data } = await updateUser({
                userId: currentUser._id,
                formData: formData,
            });
            if (data.success === false) {
                dispatch(updateUserFailure(data?.message));
                showNotification("Session Ended! Please login again", "error");
                navigate("/login");
                return;
            }
            if (data.success) {
                showNotification(data?.message, "success");
                dispatch(updateUserSuccess(data?.user));
                return;
            }
            showNotification(data?.message, "error");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserPassword = async (e) => {
        e.preventDefault();
        if (
            updatePassword.oldpassword === "" ||
            updatePassword.newpassword === ""
        ) {
            showNotification("Enter a valid password", "error");
            return;
        }
        if (updatePassword.oldpassword === updatePassword.newpassword) {
            showNotification("New password can't be the same!", "error");
            return;
        }
        try {
            dispatch(updatePassStart());
            const { data } = await updateAdminPassword({
                userId: currentUser._id,
                updatePassword,
            });
            if (data.success === false) {
                dispatch(updatePassFailure(data?.message));
                showNotification("Session Ended! Please login again", "error");
                navigate("/login");
                return;
            }
            dispatch(updatePassSuccess());
            showNotification(data?.message, "success");
            setUpdatePassword({
                oldpassword: "",
                newpassword: "",
            });
        } catch (error) {
            dispatch(updatePassFailure(error.message));
            console.log(error);
        }
    };

    return (
        <div className="updateProfile m-1 flex w-full justify-center p-3 transition-all duration-300">
            {updateProfileDetailsPanel === true ? (
                <div className="flex h-fit w-72 flex-col gap-2 self-center rounded-lg border border-gray-400 p-2 shadow-2xl sm:w-[320px]">
                    <h1 className="text-center text-2xl font-semibold">
                        Update Profile
                    </h1>
                    <div className="flex flex-col">
                        <label
                            htmlFor="username"
                            className="font-semibold">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="rounded border border-black p-1"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="address"
                            className="font-semibold">
                            Address:
                        </label>
                        <textarea
                            maxLength={200}
                            type="text"
                            id="address"
                            className="resize-none rounded border border-black p-1"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="phone"
                            className="font-semibold">
                            Phone:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="rounded border border-black p-1"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        disabled={loading}
                        onClick={updateUserDetails}
                        className="rounded bg-slate-700 p-2 text-white hover:opacity-95">
                        {loading ? "Loading..." : "Update"}
                    </button>
                    <button
                        disabled={loading}
                        type="button"
                        onClick={() => setUpdateProfileDetailsPanel(false)}
                        className="rounded bg-red-700 p-2 text-white hover:opacity-95">
                        {loading ? "Loading..." : "Change Password"}
                    </button>
                </div>
            ) : (
                <div className="flex h-fit w-72 flex-col gap-2 rounded-lg border border-gray-400 p-2 shadow-2xl sm:w-[320px]">
                    <h1 className="text-center text-2xl font-semibold">
                        Change Password
                    </h1>
                    <div className="flex flex-col">
                        <label
                            htmlFor="oldpassword"
                            className="font-semibold">
                            Enter old password:
                        </label>
                        <input
                            type="password"
                            id="oldpassword"
                            className="rounded border border-black p-1"
                            value={updatePassword.oldpassword}
                            onChange={handlePass}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="newpassword"
                            className="font-semibold">
                            Enter new password:
                        </label>
                        <input
                            type="password"
                            id="newpassword"
                            className="rounded border border-black p-1"
                            value={updatePassword.newpassword}
                            onChange={handlePass}
                        />
                    </div>
                    <button
                        disabled={loading}
                        onClick={updateUserPassword}
                        className="rounded bg-slate-700 p-2 text-white hover:opacity-95">
                        {loading ? "Loading..." : "Update Password"}
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => {
                            setUpdateProfileDetailsPanel(true);
                            setUpdatePassword({
                                oldpassword: "",
                                newpassword: "",
                            });
                        }}
                        type="button"
                        className="w-24 rounded bg-red-700 p-2 text-white hover:opacity-95">
                        {loading ? "Loading..." : "Back"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUpdateProfile;
