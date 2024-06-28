import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteHistory, getUserBookings } from "../../http";
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
    Button,
} from "@mui/material";

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
        []
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
                {loading && (
                    <h1 className="text-center text-2xl">Loading...</h1>
                )}
                {error && <h1 className="text-center text-2xl">{error}</h1>}
                <div className="w-full border-b-4">
                    <TextField
                        className="mb-2 rounded-lg border p-2"
                        variant="outlined"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                {allBookings.map((booking, i) => (
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
                                                    alt="Package Image"
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
                                        {(new Date(booking?.date).getTime() <
                                            new Date().getTime() ||
                                            booking?.status ===
                                                "Cancelled") && (
                                            <TableCell>
                                                <Button
                                                    onClick={() =>
                                                        handleHistoryDelete(
                                                            booking._id
                                                        )
                                                    }
                                                    variant="contained"
                                                    color="error"
                                                    className="text-white"
                                                    sx={{
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#d32f2f",
                                                        },
                                                    }}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        )}
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

export default MyHistory;
