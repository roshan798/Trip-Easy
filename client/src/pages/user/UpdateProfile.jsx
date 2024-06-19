import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    updatePassStart,
    updatePassSuccess,
    updatePassFailure,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router";
import { updatePassword as updateUserPasswordAPI,updateUser } from "../../http/index.js";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
        useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
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
                email: currentUser.email,
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
            currentUser.email === formData.email &&
            currentUser.address === formData.address &&
            currentUser.phone === formData.phone
        ) {
            alert("Change atleast 1 field to update details");
            return;
        }
        try {
            dispatch(updateUserStart());
            // const res = await fetch(`/api/user/update/${currentUser._id}`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(formData),
            // });
            const { data } = await updateUser({
                userId: currentUser._id,
                formData: formData,
            });
            if (
                data.success === false
            ) {
                dispatch(updateUserSuccess());
                dispatch(updateUserFailure(data?.messsage));
                alert("Session Ended! Please login again");
                navigate("/login");
                return;
            }
            if (data.success) {
                alert(data?.message);
                dispatch(updateUserSuccess(data?.user));
                return;
            }
            alert(data?.message);
            return;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserPassword = async (e) => {
        e.preventDefault();
        if (
            updatePassword.oldpassword === "" ||
            updatePassword.newpassword === ""
        ) {
            alert("Enter a valid password");
            return;
        }
        if (updatePassword.oldpassword === updatePassword.newpassword) {
            alert("New password can't be same!");
            return;
        }
        try {
            dispatch(updatePassStart());
            // const res = await fetch(
            //     `/api/user/update-password/${currentUser._id}`,
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(updatePassword),
            //     }
            // );
            // const userId = currentUser._id;
            const formData = {
                userId: currentUser._id,
                updatePassword: updatePassword,
            };
            const { data } = await updateUserPasswordAPI(formData);
            if (data.success === false) {
                dispatch(updateUserSuccess());
                dispatch(updatePassFailure(data?.message));
                alert("Session Ended! Please login again");
                navigate("/login");
                return;
            }
            dispatch(updatePassSuccess());
            alert(data?.message);
            setUpdatePassword({
                oldpassword: "",
                newpassword: "",
            });
            return;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className={`updateProfile m-1 flex w-full justify-center p-3 transition-all duration-300`}>
            {updateProfileDetailsPanel === true ? (
                <div className="flex h-fit w-72 flex-col gap-2 self-center rounded-lg border border-black p-2 sm:w-[320px]">
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
                            htmlFor="email"
                            className="font-semibold">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="rounded border border-black p-1"
                            value={formData.email}
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
                <div className="flex h-fit w-72 flex-col gap-2 rounded-lg border border-black p-2 sm:w-[320px]">
                    <h1 className="text-center text-2xl font-semibold">
                        Change Password
                    </h1>
                    <div className="flex flex-col">
                        <label
                            htmlFor="username"
                            className="font-semibold">
                            Enter old password:
                        </label>
                        <input
                            type="text"
                            id="oldpassword"
                            className="rounded border border-black p-1"
                            value={updatePassword.oldpassword}
                            onChange={handlePass}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="username"
                            className="font-semibold">
                            Enter new password:
                        </label>
                        <input
                            type="text"
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

export default UpdateProfile;
