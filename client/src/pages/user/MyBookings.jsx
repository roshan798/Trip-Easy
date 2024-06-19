import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cancelBooking, getUserCurrentBookings } from "../../http";
import debounce from "../../utils/debounceFunction";

const MyBookings = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [currentBookings, setCurrentBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getAllBookings = async (searchTerm) => {
        setCurrentBookings([]);
        try {
            setLoading(true);
            const queryParams = {
                userId: currentUser._id,
                searchQuery: `?searchTerm=${searchTerm}`,
            };
            const { data } = await getUserCurrentBookings(queryParams);
            if (data?.success) {
                setCurrentBookings(data?.bookings);
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
        []
    );

    useEffect(() => {
        if (currentUser) {
            debouncedGetAllBookings(searchTerm);
        }
    }, [searchTerm, currentUser, debouncedGetAllBookings]);

    const handleCancel = async (id) => {
        try {
            setLoading(true);
            const queryParams = {
                bookingId: id,
                userId: currentUser._id,
            };
            const { data } = await cancelBooking(queryParams);
            if (data?.success) {
                alert(data?.message);
                getAllBookings(searchTerm);
            } else {
                alert(data?.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full justify-center">
            <div className="flex w-[95%] flex-col gap-2 rounded-lg p-3 shadow-xl">
                {loading && (
                    <h1 className="text-center text-2xl">Loading...</h1>
                )}
                {error && <h1 className="text-center text-2xl">{error}</h1>}
                <div className="w-full border-b-4">
                    <input
                        className="mb-2 rounded-lg border p-2"
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {!loading &&
                    currentBookings &&
                    currentBookings.map((booking, i) => {
                        return (
                            <div
                                className="flex w-full flex-wrap items-center justify-between gap-3 overflow-auto border-y-2 p-3"
                                key={i}>
                                <Link
                                    to={`/package/${booking?.packageDetails?._id}`}>
                                    <img
                                        className="h-12 w-12"
                                        src={
                                            booking?.packageDetails
                                                ?.packageImages[0]
                                        }
                                        alt="Package Image"
                                    />
                                </Link>
                                <Link
                                    to={`/package/${booking?.packageDetails?._id}`}>
                                    <p className="hover:underline">
                                        {booking?.packageDetails?.packageName}
                                    </p>
                                </Link>
                                <p>{booking?.buyer?.username}</p>
                                <p>{booking?.buyer?.email}</p>
                                <p>{booking?.date}</p>
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="rounded bg-red-600 p-2 text-white hover:opacity-95">
                                    Cancel
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default MyBookings;
