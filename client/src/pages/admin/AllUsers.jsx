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
      "Are you sure? The account will be permanently deleted!",
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
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
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
            placeholder="Search name, email, or phone..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUser.length > 0 ? (
                allUser.map((user, i) => (
                  <tr
                    key={user._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="border p-2">{user._id}</td>
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.address}</td>
                    <td className="border p-2">{user.phone}</td>
                    <td className="border p-2 text-center">
                      <button
                        disabled={loading}
                        className="text-red-500 hover:scale-125 hover:cursor-pointer disabled:opacity-80"
                        onClick={() => {
                          handleUserDelete(user._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-2">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
