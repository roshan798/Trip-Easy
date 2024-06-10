import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteUser, getAllUsers } from "../../http";

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getUsers = async () => {
        try {
            setLoading(true);
            const queryParams = {
                searchQUery: `?searchTerm=${search}`,
            };
            const { data } = await getAllUsers(queryParams);
            if (data && data?.success === false) {
                setLoading(false);
                setError(data?.message);
            } else {
                setLoading(false);
                setAllUsers(data);
                setError(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUsers();
        if (search) getUsers();
    }, [search]);

    const handleUserDelete = async (userId) => {
        const CONFIRM = confirm(
            "Are you sure ? the account will be permenantly deleted!"
        );
        if (CONFIRM) {
            setLoading(true);
            try {
                const { data } = await deleteUser(userId);
                if (data?.success === false) {
                    setLoading(false);
                    alert("Something went wrong!");
                    return;
                }
                setLoading(false);
                alert(data?.message);
                getUsers();
            } catch (error) {}
        }
    };

    return (
        <>
            <div className="flex w-full justify-center">
                <div className="w-full rounded-lg p-2 shadow-lg">
                    <h1 className="text-center text-2xl">
                        {loading ? "Loading..." : "All Users"}
                    </h1>
                    {error && <h1 className="text-center text-2xl">{error}</h1>}
                    <div>
                        <input
                            type="text"
                            className="my-3 rounded-lg border p-2"
                            placeholder="Search name,email or phone..."
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                    </div>
                    {allUser ? (
                        allUser.map((user, i) => {
                            return (
                                <div
                                    className="flex justify-between gap-3 overflow-auto border-y-2 p-2 px-3"
                                    key={i}>
                                    <h5 className="flex flex-1 items-center justify-center text-ellipsis p-[5px]">
                                        {user._id}
                                    </h5>
                                    <h5 className="flex flex-1 items-center justify-center text-ellipsis p-[5px]">
                                        {user.username}
                                    </h5>
                                    <h5 className="flex flex-1 items-center justify-center text-ellipsis p-[5px]">
                                        {user.email}
                                    </h5>
                                    <h5 className="flex flex-1 items-center justify-center text-ellipsis p-[5px]">
                                        {user.address}
                                    </h5>
                                    <h5 className="flex flex-1 items-center justify-center text-ellipsis p-[5px]">
                                        {user.phone}
                                    </h5>
                                    <div className="flex flex-1 flex-col items-center justify-center p-[5px]">
                                        <button
                                            disabled={loading}
                                            className="p-2 text-red-500 hover:scale-125 hover:cursor-pointer disabled:opacity-80"
                                            onClick={() => {
                                                handleUserDelete(user._id);
                                            }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllUsers;
