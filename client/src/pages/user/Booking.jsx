import { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { bookPackage, getBraintreeToken, getPackage } from "../../http";

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
        packageActivities: "",
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
    const [instance, setInstance] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    const getPackageData = async () => {
        try {
            setLoading(true);
            const reqData = {
                packageId: params?.packageId,
            };
            const { data } = await getPackage(reqData);
            if (data?.success) {
                setPackageData({
                    packageName: data?.packageData?.packageName,
                    packageDescription: data?.packageData?.packageDescription,
                    packageDestination: data?.packageData?.packageDestination,
                    packageDays: data?.packageData?.packageDays,
                    packageNights: data?.packageData?.packageNights,
                    packageAccommodation:
                        data?.packageData?.packageAccommodation,
                    packageTransportation:
                        data?.packageData?.packageTransportation,
                    packageMeals: data?.packageData?.packageMeals,
                    packageActivities: data?.packageData?.packageActivities,
                    packagePrice: data?.packageData?.packagePrice,
                    packageDiscountPrice:
                        data?.packageData?.packageDiscountPrice,
                    packageOffer: data?.packageData?.packageOffer,
                    packageRating: data?.packageData?.packageRating,
                    packageTotalRatings: data?.packageData?.packageTotalRatings,
                    packageImages: data?.packageData?.packageImages,
                });
            } else {
                setError(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    //get paymentgateway token
    const getToken = async () => {
        try {
            const { data } = await getBraintreeToken();
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getToken();
    }, [currentUser]);

    //handle payment & book package
    const handleBookPackage = async () => {
        if (
            bookingData.packageDetails === "" ||
            bookingData.buyer === "" ||
            bookingData.totalPrice <= 0 ||
            bookingData.persons <= 0 ||
            bookingData.date === ""
        ) {
            alert("All fields are required!");
            return;
        }
        try {
            setLoading(true);
            // const res = await fetch(`/api/booking/book-package/${params?.id}`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(bookingData),
            // });
            const queryParams = {
                packageId: params.id,
                bookingData: bookingData,
            };
            const { data } = await bookPackage(queryParams);
            if (data?.success) {
                setLoading(false);
                alert(data?.message);
                navigate(
                    `/profile/${
                        currentUser?.user_role === 1 ? "admin" : "user"
                    }`
                );
            } else {
                setLoading(false);
                alert(data?.message);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params?.packageId) {
            getPackageData();
        }
        let date = new Date().toISOString().substring(0, 10);
        let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
        setCurrentDate(d);
    }, [params?.packageId]);

    useEffect(() => {
        if (packageData && params?.packageId) {
            setBookingData({
                ...bookingData,
                packageDetails: params?.packageId,
                buyer: currentUser?._id,
                totalPrice: packageData?.packageDiscountPrice
                    ? packageData?.packageDiscountPrice * bookingData?.persons
                    : packageData?.packagePrice * bookingData?.persons,
            });
        }
    }, [packageData, params]);

    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex w-[95%] flex-col items-center gap-3 rounded p-6 shadow-2xl">
                <h1 className="text-center text-2xl font-bold">Book Package</h1>
                {/* user info */}
                <div className="flex w-full flex-wrap justify-center gap-2">
                    <div className="pr-3 md:border-r md:pr-6">
                        <div className="xsm:w-72 flex h-fit w-64 flex-col gap-2 p-2">
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
                                    value={currentUser.username}
                                    disabled
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
                                    value={currentUser.email}
                                    disabled
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
                                    value={currentUser.address}
                                    disabled
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
                                    value={currentUser.phone}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    {/* package info */}
                    <div className="pl-3 md:border-l md:pl-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-2">
                                <img
                                    className="w-28"
                                    src={packageData.packageImages[0]}
                                    alt="Package image"
                                />
                                <div>
                                    <p className="mb-1 text-lg font-semibold capitalize">
                                        {packageData.packageName}
                                    </p>
                                    <p className="flex gap-2 font-semibold capitalize text-green-700">
                                        <FaMapMarkerAlt />{" "}
                                        {packageData.packageDestination}
                                    </p>
                                    {/* days & nights */}
                                    {(+packageData.packageDays > 0 ||
                                        +packageData.packageNights > 0) && (
                                        <p className="flex items-center gap-2">
                                            <FaClock />
                                            {+packageData.packageDays > 0 &&
                                                (+packageData.packageDays > 1
                                                    ? packageData.packageDays +
                                                      " Days"
                                                    : packageData.packageDays +
                                                      " Day")}
                                            {+packageData.packageDays > 0 &&
                                                +packageData.packageNights >
                                                    0 &&
                                                " - "}
                                            {+packageData.packageNights > 0 &&
                                                (+packageData.packageNights > 1
                                                    ? packageData.packageNights +
                                                      " Nights"
                                                    : packageData.packageNights +
                                                      " Night")}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="my-1 flex flex-col">
                                <label
                                    className="font-semibold"
                                    htmlFor="date">
                                    Select Date:
                                </label>
                                <input
                                    type="date"
                                    min={currentDate !== "" ? currentDate : ""}
                                    //   min={"2024-01-23"}
                                    id="date"
                                    className="w-max rounded border"
                                    onChange={(e) => {
                                        setBookingData({
                                            ...bookingData,
                                            date: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            {/* price */}
                            <p className="my-1 flex gap-1 text-xl font-semibold">
                                Price:
                                {packageData.packageOffer ? (
                                    <>
                                        <span className="text-gray-700 line-through">
                                            ${packageData.packagePrice}
                                        </span>{" "}
                                        -
                                        <span>
                                            ${packageData.packageDiscountPrice}
                                        </span>
                                        <span className="ml-2 rounded bg-green-700 p-1 text-lg text-white">
                                            {Math.floor(
                                                ((+packageData.packagePrice -
                                                    +packageData.packageDiscountPrice) /
                                                    +packageData.packagePrice) *
                                                    100
                                            )}
                                            % Off
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-green-700">
                                        ${packageData.packagePrice}
                                    </span>
                                )}
                            </p>
                            {/* price */}
                            <div className="flex w-max border-2">
                                <button
                                    className="p-2 py-1 font-semibold"
                                    onClick={() => {
                                        if (bookingData.persons > 1) {
                                            setBookingData({
                                                ...bookingData,
                                                persons:
                                                    (bookingData.persons -= 1),
                                                totalPrice:
                                                    packageData.packageDiscountPrice
                                                        ? packageData.packageDiscountPrice *
                                                          bookingData.persons
                                                        : packageData.packagePrice *
                                                          bookingData.persons,
                                            });
                                        }
                                    }}>
                                    -
                                </button>
                                <input
                                    value={bookingData.persons}
                                    disabled
                                    type="text"
                                    className="w-10 border text-center text-lg"
                                />
                                <button
                                    className="p-2 py-1 font-semibold"
                                    onClick={() => {
                                        if (bookingData.persons < 10) {
                                            setBookingData({
                                                ...bookingData,
                                                persons:
                                                    (bookingData.persons += 1),
                                                totalPrice:
                                                    packageData.packageDiscountPrice
                                                        ? packageData.packageDiscountPrice *
                                                          bookingData.persons
                                                        : packageData.packagePrice *
                                                          bookingData.persons,
                                            });
                                        }
                                    }}>
                                    +
                                </button>
                            </div>
                            <p className="text-xl font-semibold">
                                Total Price:
                                <span className="text-green-700">
                                    $
                                    {packageData.packageDiscountPrice
                                        ? packageData.packageDiscountPrice *
                                          bookingData.persons
                                        : packageData.packagePrice *
                                          bookingData.persons}
                                </span>
                            </p>
                            <div className="my-2 max-w-[300px] gap-1">
                                <p
                                    className={`font-semibold ${
                                        instance && "text-sm text-red-700"
                                    }`}>
                                    Payment:
                                    {!instance
                                        ? "Loading..."
                                        : "Don't use your original card details!(This is not the production build)"}
                                </p>
                                {clientToken && (
                                    <>
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: {
                                                    flow: "vault",
                                                },
                                            }}
                                            onInstance={(instance) =>
                                                setInstance(instance)
                                            }
                                        />
                                        <button
                                            className="payment-btn disabled:optional:80 cursor-pointer rounded bg-blue-600 p-2 text-white hover:opacity-95"
                                            onClick={handleBookPackage}
                                            disabled={
                                                loading ||
                                                !instance ||
                                                !currentUser?.address
                                            }>
                                            {loading
                                                ? "Processing..."
                                                : "Book Now"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
