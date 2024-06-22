import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteHistory, getUserBookings } from "../../http";
import debounce from "../../utils/debounceFunction";

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async (searchTerm) => {
    try {
      setLoading(true);
      const queryParams = {
        userId: currentUser._id,
        searchQuery: `?searchTerm=${searchTerm}`,
      };
      const { data } = await getUserBookings(queryParams);
      if (data?.success) {
        setAllBookings(data?.bookings);
        setError(false);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of getAllBookings
  const debouncedGetAllBookings = useCallback(
    debounce(getAllBookings, 500),
    [],
  );

  useEffect(() => {
    if (currentUser) {
      debouncedGetAllBookings(search);
    }
  }, [search, currentUser, debouncedGetAllBookings]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const queryParams = {
        id: id,
        userId: currentUser._id,
      };
      const data = await deleteHistory(queryParams);
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings(search);
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[95%] flex-col gap-2 rounded-lg p-3 shadow-xl">
        <h1 className="text-center text-2xl">History</h1>
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && <h1 className="text-center text-2xl">{error}</h1>}
        <div className="w-full border-b-4">
          <input
            className="mb-2 rounded-lg border p-2"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!loading &&
          allBookings &&
          allBookings.map((booking, i) => {
            return (
              <div
                className="flex w-full flex-wrap items-center justify-between gap-3 overflow-auto border-y-2 p-3"
                key={i}
              >
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="h-12 w-12"
                    src={booking?.packageDetails?.packageImages[0]}
                    alt="Package Image"
                  />
                </Link>
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>
                <p>{booking?.buyer?.username}</p>
                <p>{booking?.buyer?.email}</p>
                <p>{booking?.date}</p>
                {(new Date(booking?.date).getTime() < new Date().getTime() ||
                  booking?.status === "Cancelled") && (
                  <button
                    onClick={() => handleHistoryDelete(booking._id)}
                    className="rounded bg-red-600 p-2 text-white hover:opacity-95"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyHistory;
