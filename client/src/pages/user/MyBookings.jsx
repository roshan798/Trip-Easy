import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cancelBooking, getUserCurrentBookings } from "../../http";
import debounce from "../../utils/debounceFunction";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
} from "@mui/material";
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
                    <div className="flex items-center justify-center h-40">
                        <CircularProgress />
                    </div>
                )}
                {error && (
                    <h1 className="text-center text-2xl text-red-500">
                        {error}
                    </h1>
                )}
                <div className="w-full border-b-4">
                    <TextField
                        className="mb-2 rounded-lg border p-2"
                        variant="outlined"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {!loading && (
                    <TableContainer
                        component={Paper}
                        className="mt-4">
                        <Table aria-label="booking table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Package Image</TableCell>
                                    <TableCell>Package Name</TableCell>
                                    <TableCell>Buyer Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentBookings.map((booking, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Link
                                                to={`/package/${booking?.packageDetails?._id}`}>
                                                <img
                                                    className="h-12 w-12"
                                                    src={
                                                        booking?.packageDetails
                                                            ?.packageImages[0]
                                                    }
                                                    alt="Package"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                to={`/package/${booking?.packageDetails?._id}`}>
                                                {
                                                    booking?.packageDetails
                                                        ?.packageName
                                                }
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {booking?.buyer?.username}
                                        </TableCell>
                                        <TableCell>
                                            {booking?.buyer?.email}
                                        </TableCell>
                                        <TableCell>{booking?.date}</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() =>
                                                    handleCancel(booking._id)
                                                }
                                                className="rounded bg-red-600 p-2 text-white hover:opacity-95">
                                                Cancel
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
