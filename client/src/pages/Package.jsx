import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
    FaArrowDown,
    FaArrowLeft,
    FaArrowRight,
    FaArrowUp,
    FaClock,
    FaMapMarkerAlt,
    FaShare,
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import {
    getPackage,
    checkRatingGiven as checkRatingGivenApi,
    getRatings as getRatingsApi,
} from "../http/index.js";
import { useNotification } from "../hooks/useNotification.js";

const Package = () => {
    SwiperCore.use([Navigation]);
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
    const [ratingsData, setRatingsData] = useState({
        rating: 0,
        review: "",
        packageId: params?.id,
        userRef: currentUser?._id,
        username: currentUser?.username,
        userProfileImg: currentUser?.avatar,
    });
    const [packageRatings, setPackageRatings] = useState([]);
    const [ratingGiven, setRatingGiven] = useState(false);
    const showNotification = useNotification();

    const getPackageData = async () => {
        try {
            setLoading(true);
            const reqData = {
                packageId: params?.id,
            };
            const { data } = await getPackage(reqData);
            if (data?.success) {
                setPackageData({ ...data.packageData });
            } else {
                setError(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const giveRating = async () => {
        checkRatingGiven();
        if (ratingGiven) {
            showNotification("You already submittd your rating!", "warning");
            return;
        }
        if (ratingsData.rating === 0 && ratingsData.review === "") {
            showNotification("Atleast 1 field is required!", "warning");
            return;
        }
        if (
            ratingsData.rating === 0 &&
            ratingsData.review === "" &&
            !ratingsData.userRef
        ) {
            showNotification("All fields are required!", "warning");
            return;
        }
        try {
            setLoading(true);
            const { data } = await giveRating(ratingsData);
            if (data?.success) {
                showNotification(data.message, "success");
                getPackageData();
                getRatings();
                checkRatingGiven();
            } else {
                showNotification(
                    data?.message || "Something went wrong!",
                    "error"
                );
            }
        } catch (error) {
            showNotification(error.message || "Something went wrong!", "error");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getRatings = async () => {
        try {
            const reqData = {
                packageId: params.id,
                searchQuery: 4,
            };
            const { data } = await getRatingsApi(reqData);
            if (data) {
                setPackageRatings(data);
            } else {
                setPackageRatings("No ratings yet!");
            }
        } catch (error) {
            console.log(error);
            setPackageRatings("Something wrong happend");
        }
    };

    const checkRatingGiven = async () => {
        try {
            const reqData = {
                userId: currentUser?._id,
                packageId: params?.id,
            };
            const { data } = await checkRatingGivenApi(reqData);
            setRatingGiven(data?.given);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShare = async () => {
        const {
            packageName,
            packageDescription,
            packageDestination,
            packageDays,
            packageNights,
            packagePrice,
            packageDiscountPrice,
            packageOffer,
        } = packageData;

        const topic = packageName || "Check out this amazing package!";
        const text = `
          ${packageName} - ${packageDestination}
          ${packageDescription}
          Duration: ${packageDays} days and ${packageNights} nights
          Price: $${packagePrice}${
            packageOffer ? ` (Discounted to $${packageDiscountPrice})` : ""
        }
      `.trim();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: topic,
                    text: text,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            console.warn("Web Share API not supported in this browser.");
        }
    };

    useEffect(() => {
        if (params.id) {
            getPackageData();
            getRatings();
        }
        if (currentUser) {
            checkRatingGiven();
        }
    }, [params.id, currentUser]);
    packageData?.packageImages.map((image) => {
        console.log(image);
    });
    return (
        <div className="w-full">
            {loading && (
                <p
                    className="text-center font-semibold"
                    id="loading">
                    Loading...
                </p>
            )}
            {error && (
                <div className="flex w-full flex-col items-center gap-2">
                    <p className="text-center text-red-700">
                        Something went wrong!
                    </p>
                    <Link
                        className="w-min rounded-lg bg-slate-600 p-3 py-2 text-white"
                        to="/">
                        Back
                    </Link>
                </div>
            )}
            {packageData && !loading && !error && (
                <div className="w-full">
                    <Swiper navigation>
                        {packageData?.packageImages.map((imageUrl, i) => (
                            <SwiperSlide key={i}>
                                <div
                                    className="h-[400px]"
                                    style={{
                                        backgroundImage: `url('${imageUrl}')`,
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                    }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* copy button */}
                    <div
                        className="absolute right-[3%] top-[13%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-slate-100"
                        onClick={() => {
                            handleShare();
                        }}>
                        <FaShare className="text-slate-500" />
                    </div>
                    {/* back button */}
                    <div className="absolute left-[3%] top-[13%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-slate-100">
                        <FaArrowLeft
                            className="text-slate-500"
                            onClick={() => {
                                navigate("/");
                            }}
                        />
                    </div>
                    <div className="flex w-full max-w-4xl flex-col gap-2 p-5 ">
                        <p className="text-2xl font-bold capitalize">
                            {packageData?.packageName}
                        </p>
                        {/* price */}
                        <p className="my-3 flex gap-1 text-2xl font-semibold">
                            {packageData?.packageOffer ? (
                                <>
                                    <span className="text-gray-700 line-through">
                                        &#8377; {packageData?.packagePrice}
                                    </span>{" "}
                                    -
                                    <span>
                                        &#8377;{" "}
                                        {packageData?.packageDiscountPrice}
                                    </span>
                                    <span className="ml-2 rounded bg-green-700 p-1 text-lg text-white">
                                        {Math.floor(
                                            ((+packageData?.packagePrice -
                                                +packageData?.packageDiscountPrice) /
                                                +packageData?.packagePrice) *
                                                100
                                        )}
                                        % Off
                                    </span>
                                </>
                            ) : (
                                <span>&#8377;{packageData?.packagePrice}</span>
                            )}
                        </p>
                        {/* price */}
                        {/* destination */}
                        <p className="flex items-center gap-1 text-lg capitalize text-green-700">
                            <FaMapMarkerAlt />
                            {packageData?.packageDestination}
                        </p>
                        {/* destination */}
                        {/* days & nights */}
                        {(+packageData?.packageDays > 0 ||
                            +packageData?.packageNights > 0) && (
                            <p className="flex items-center gap-2">
                                <FaClock />
                                {+packageData?.packageDays > 0 &&
                                    (+packageData?.packageDays > 1
                                        ? packageData?.packageDays + " Days"
                                        : packageData?.packageDays + " Day")}
                                {+packageData?.packageDays > 0 &&
                                    +packageData?.packageNights > 0 &&
                                    " - "}
                                {+packageData?.packageNights > 0 &&
                                    (+packageData?.packageNights > 1
                                        ? packageData?.packageNights + " Nights"
                                        : packageData?.packageNights +
                                          " Night")}
                            </p>
                        )}
                        {/* days & nights */}
                        {/* rating */}
                        {packageData?.packageTotalRatings > 0 && (
                            <div className="flex">
                                <Rating
                                    value={packageData?.packageRating || 0}
                                    readOnly
                                    precision={0.1}
                                />
                                <p>({packageData?.packageTotalRatings})</p>
                            </div>
                        )}
                        {/* rating */}
                        {/* Description */}
                        <div className="mt-2 flex w-full flex-col">
                            {/* <h4 className="text-xl">Description:</h4> */}
                            <p className="flex flex-col break-all font-medium">
                                {packageData?.packageDescription.length >
                                280 ? (
                                    <>
                                        <span id="desc">
                                            {packageData?.packageDescription.substring(
                                                0,
                                                150
                                            )}
                                            ...
                                        </span>
                                        <button
                                            id="moreBtn"
                                            onClick={() => {
                                                document.getElementById(
                                                    "desc"
                                                ).innerText =
                                                    packageData?.packageDescription;
                                                document.getElementById(
                                                    "moreBtn"
                                                ).style.display = "none";
                                                document.getElementById(
                                                    "lessBtn"
                                                ).style.display = "flex";
                                            }}
                                            className="flex w-max items-center gap-2 font-semibold text-gray-600 hover:underline">
                                            More <FaArrowDown />
                                        </button>
                                        <button
                                            id="lessBtn"
                                            onClick={() => {
                                                document.getElementById(
                                                    "desc"
                                                ).innerText =
                                                    packageData?.packageDescription;
                                                document.getElementById(
                                                    "desc"
                                                ).innerText =
                                                    packageData?.packageDescription.substring(
                                                        0,
                                                        150
                                                    ) + "...";
                                                document.getElementById(
                                                    "lessBtn"
                                                ).style.display = "none";
                                                document.getElementById(
                                                    "moreBtn"
                                                ).style.display = "flex";
                                            }}
                                            className="ml-2 hidden w-max items-center gap-2 font-semibold text-gray-600 hover:underline">
                                            Less <FaArrowUp />
                                        </button>
                                    </>
                                ) : (
                                    <>{packageData?.packageDescription}</>
                                )}
                            </p>
                        </div>
                        <div className="flex w-full justify-center sm:justify-normal">
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentUser) {
                                        navigate(`/booking/${params?.id}`);
                                    } else {
                                        navigate("/login");
                                    }
                                }}
                                className="w-full rounded bg-green-700 p-3 text-white hover:opacity-95 sm:w-[200px]">
                                Book Now
                            </button>
                        </div>
                        {/* Description */}
                        {/* Accommodation */}
                        <div className="mt-2 flex w-full flex-col">
                            <h4 className="text-xl">Accommodation:</h4>
                            <p>{packageData?.packageAccommodation}</p>
                        </div>
                        {/* Accommodation */}
                        {/* Activities */}
                        <div className="mt-2 flex w-full flex-col">
                            <h4 className="text-xl">Activities:</h4>
                            <p>{packageData?.packageActivities}</p>
                        </div>
                        {/* Activities */}
                        {/* meals */}
                        <div className="mt-2 flex w-full flex-col">
                            <h4 className="text-xl">Meals:</h4>
                            <p>{packageData?.packageMeals}</p>
                        </div>
                        {/* meals */}
                        {/* Transportation */}
                        <div className="mt-2 flex w-full flex-col">
                            <h4 className="text-xl">Transportation:</h4>
                            <p>{packageData?.packageTransportation}</p>
                        </div>
                        {/* Transportation */}
                        <hr />
                        {/* give rating/review */}
                        <div className="mt-2 flex w-full flex-col items-center">
                            {packageRatings && (
                                <>
                                    <h4 className="text-xl">Rating/Reviews:</h4>
                                    <div
                                        className={`w-full gap-2 sm:max-w-[640px] ${
                                            !currentUser || ratingGiven
                                                ? "hidden"
                                                : "flex flex-col items-center"
                                        } `}>
                                        <Rating
                                            name="simple-controlled"
                                            className="w-max"
                                            value={ratingsData?.rating}
                                            onChange={(e, newValue) => {
                                                setRatingsData({
                                                    ...ratingsData,
                                                    rating: newValue,
                                                });
                                            }}
                                        />
                                        <textarea
                                            className="w-full resize-none rounded border border-black p-3"
                                            rows={3}
                                            placeholder="Review"
                                            value={ratingsData?.review}
                                            onChange={(e) => {
                                                setRatingsData({
                                                    ...ratingsData,
                                                    review: e.target.value,
                                                });
                                            }}></textarea>
                                        <button
                                            disabled={
                                                (ratingsData.rating === 0 &&
                                                    ratingsData.review ===
                                                        "") ||
                                                loading
                                            }
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                giveRating();
                                            }}
                                            className="w-full rounded bg-green-700 p-2 text-white hover:opacity-95 disabled:opacity-80">
                                            {loading ? "Loading..." : "Submit"}
                                        </button>
                                        <hr />
                                    </div>
                                    <div className="mt-3 flex w-full flex-wrap justify-center gap-2 sm:justify-normal">
                                        <RatingCard
                                            packageRatings={packageRatings}
                                        />
                                        {packageData.packageTotalRatings >
                                            4 && (
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/package/ratings/${params?.id}`
                                                    )
                                                }
                                                className="flex h-max items-center gap-2 rounded border p-2 hover:bg-slate-500 hover:text-white">
                                                View All <FaArrowRight />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                            {(!currentUser || currentUser === null) && (
                                <button
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                    className="rounded bg-green-700 p-2 text-white">
                                    Rate Package
                                </button>
                            )}
                        </div>
                        {/* give rating/review */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Package;
