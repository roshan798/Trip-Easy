import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cancelBooking, getCurrentBookings } from "../../http";
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

const AllBookings = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [currentBookings, setCurrentBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getAllBookings = async () => {
        setCurrentBookings([]);
        try {
            setLoading(true);

            const { data } = await getCurrentBookings(searchTerm);

            if (data?.success) {
                setCurrentBookings(data?.bookings);
                setLoading(false);
                setError(false);
            } else {
                setLoading(false);
                setError(data?.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBookings();
    }, []); // Run once on component mount

    // Local search filtering
    const filteredBookings = currentBookings.filter(
        (booking) =>
            booking?.buyer?.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking?.buyer?.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const handleCancel = async (id) => {
        try {
            setLoading(true);
            const { data } = await cancelBooking({
                bookingId: id,
                userId: currentUser._id,
            });
            if (data?.success) {
                setLoading(false);
                alert(data?.message);
                getAllBookings(); // Refresh bookings after cancellation
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
                {loading && (
                    <h1 className="text-center text-2xl">Loading...</h1>
                )}
                {error && <h1 className="text-center text-2xl">{error}</h1>}
                <div className="w-full border-b-4">
                    <TextField
                        className="mb-2 rounded-lg border p-2"
                        type="text"
                        placeholder="Search Username or Email"
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
                                {filteredBookings.map((booking, i) => (
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
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleCancel(booking._id)
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
                                                Cancel
                                            </Button>
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

export default AllBookings;
