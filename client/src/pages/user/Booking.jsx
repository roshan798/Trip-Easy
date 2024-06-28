import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { bookPackage, getBraintreeToken, getPackage } from "../../http";
import UserDetails from "./Booking/UserDetails";
import PackageDetails from "./Booking/PackageDetails";
import PaymentSection from "./Booking/PaymentSection";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const Booking = () => {
    const { currentUser } = useSelector((state) => state.user);
    const params = useParams();
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageRating: 0,
        packageTotalRatings: 0,
        packageImages: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookingData, setBookingData] = useState({
        totalPrice: 0,
        packageDetails: null,
        buyer: null,
        persons: 1,
        date: null,
    });
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState(null);
    const [currentDate, setCurrentDate] = useState("");

    const getPackageData = async () => {
        try {
            setLoading(true);
            const reqData = { packageId: params?.packageId };
            const { data } = await getPackage(reqData);
            if (data?.success) {
                setPackageData({ ...data.packageData });
            } else {
                setError(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch package data.");
        } finally {
            setLoading(false);
        }
    };

    const getToken = async () => {
        try {
            const { data } = await getBraintreeToken();
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
            setError("Failed to get payment token.");
        }
    };

    useEffect(() => {
        if (params?.packageId) {
            getPackageData();
        }
        getToken();
    }, [params?.packageId]);

    useEffect(() => {
        if (packageData && params?.packageId) {
            setBookingData((prevData) => ({
                ...prevData,
                packageDetails: params?.packageId,
                buyer: currentUser?._id,
                totalPrice: packageData?.packageDiscountPrice
                    ? packageData?.packageDiscountPrice * bookingData?.persons
                    : packageData?.packagePrice * bookingData?.persons,
            }));
        }
    }, [packageData, params, currentUser]);

    useEffect(() => {
        const date = new Date().toISOString().substring(0, 10);
        const d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
        setCurrentDate(d);
    }, []);

    const handleBookPackage = async () => {
        if (!instance || !bookingData.date) {
            alert("All fields are required!");
            return;
        }

        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const queryParams = {
                packageId: params.packageId,
                bookingData: {
                    ...bookingData,
                    paymentMethodNonce: nonce,
                },
            };

            const { data } = await bookPackage(queryParams);
            console.log("starting req");
            // const { data } = await makePayment();
            console.log(data);
            if (data?.success) {
                alert(data?.message);
                navigate(
                    `/profile/${
                        currentUser?.user_role === 1 ? "admin" : "user"
                    }`
                );
            } else {
                alert(data?.message);
            }
        } catch (error) {
            console.log(error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex w-[95%] flex-col items-center gap-3 rounded p-6 shadow-2xl">
                <h1 className="text-center text-2xl font-bold">Book Package</h1>
                <div className="flex w-full flex-wrap justify-center gap-2">
                    <UserDetails currentUser={currentUser} />
                    <PackageDetails
                        packageData={packageData}
                        bookingData={bookingData}
                        setBookingData={setBookingData}
                        currentDate={currentDate}
                    />
                    <PaymentSection
                        clientToken={clientToken}
                        instance={instance}
                        setInstance={setInstance}
                        handleBookPackage={handleBookPackage}
                        loading={loading}
                        currentUser={currentUser}
                    />
                </div>
          {/* Table displaying booking details */}
                <TableContainer
                    component={Paper}
                    className="mt-4">
                    <Table aria-label="booking details">
                        <TableHead>
                            <TableRow>
                                <TableCell>Field</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Package Name</TableCell>
                                <TableCell>{packageData.packageName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Package Description</TableCell>
                                <TableCell>
                                    {packageData.packageDescription}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Price</TableCell>
                                <TableCell>{bookingData.totalPrice}</TableCell>
                            </TableRow>
                            {/* Add more rows as needed */}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Booking;
