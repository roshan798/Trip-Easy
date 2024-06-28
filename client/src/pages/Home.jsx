import { useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";
import { getPackages } from "../http";
import Loader from "./components/shared/Loader";
import { useNotification } from "../hooks/useNotification";

const Home = () => {
    const navigate = useNavigate();
    const [topPackages, setTopPackages] = useState([]);
    const [latestPackages, setLatestPackages] = useState([]);
    const [offerPackages, setOfferPackages] = useState([]);
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingLatest, setLoadingLatest] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [search, setSearch] = useState("");
    const showNotification = useNotification();
    const RESULTS_PER_PAGE = 8;

    const fetchPackages = async (key, setter, apiParams, setLoading) => {
        try {
            setLoading(true);
            const { data } = await getPackages(apiParams);
            if (data?.success) {
                sessionStorage.setItem(key, JSON.stringify(data.packages));
                setter(data.packages);
            } else {
                showNotification(data?.message || "Something went wrong!", "error");
            }
        } catch (error) {
            showNotification(error?.message || "Something went wrong!", "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getPackagesFromStorage = (key, setter, apiParams, setLoading) => {
        const storedPackages = sessionStorage.getItem(key);
        if (storedPackages) {
            setter(JSON.parse(storedPackages));
        } else {
            fetchPackages(key, setter, apiParams, setLoading);
        }
    };

    useEffect(() => {
        getPackagesFromStorage(
            "topPackages",
            setTopPackages,
            { sortBy: "packageRating", resultsPerPage: RESULTS_PER_PAGE },
            setLoadingTop
        );
        getPackagesFromStorage(
            "latestPackages",
            setLatestPackages,
            { sortBy: "createdAt", resultsPerPage: RESULTS_PER_PAGE },
            setLoadingLatest
        );
        getPackagesFromStorage(
            "offerPackages",
            setOfferPackages,
            { sortBy: "createdAt", resultsPerPage: RESULTS_PER_PAGE, offer: true },
            setLoadingOffers
        );
    }, []);

    return (
        <div className="main w-full">
            <div className="flex w-full flex-col">
                <div className="backaground_image w-full"></div>
                <div className="top-part flex w-full flex-col gap-4">
                    <div className="mt-4 flex w-full items-center justify-center">
                        <input
                            type="text"
                            className="w-[230px] rounded-s-lg p-3 shadow shadow-gray-800 placeholder:text-gray-200 bg-white/30 font-semibold text-white outline-none sm:w-2/5"
                            placeholder="Search by Destination, Activity, or Package Name"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                        <button
                            onClick={() => {
                                navigate(`/search?searchTerm=${search}`);
                            }}
                            className="flex hover:bg-gray-100 h-full px-4 items-center justify-center rounded-e-lg bg-gray-300 text-xl transition-colors font-semibold">
                            Search
                        </button>
                    </div>
                    <div className="flex w-[90%] max-w-xl justify-center *:text-xl *:p-2 *:justify-between *:flex *:items-center *:flex-nowrap *:gap-2 *:px-4 *:py-2">
                        <button
                            onClick={() => {
                                navigate("/search?offer=true");
                            }}
                            className="xxsm:text-sm rounded-s-md border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:bg-gray-600 sm:text-lg">
                            Best Offers
                            <LuBadgePercent className="text-2xl" />
                        </button>
                        <button
                            onClick={() => {
                                navigate("/search?sort=packageRating");
                            }}
                            className="xxsm:text-sm border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:bg-gray-600 sm:text-lg">
                            Top Rated
                            <FaStar className="text-2xl" />
                        </button>
                        <button
                            onClick={() => {
                                navigate("/search?sort=createdAt");
                            }}
                            className="xxsm:text-sm border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:bg-gray-600 sm:text-lg">
                            Latest
                            <FaCalendar className="text-lg" />
                        </button>
                        <button
                            onClick={() => {
                                navigate("/search?sort=packageTotalRatings");
                            }}
                            className="xxsm:text-sm rounded-e-md border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:bg-gray-600 sm:text-lg">
                            Most Rated
                            <FaRankingStar className="text-2xl" />
                        </button>
                    </div>
                </div>
                {/* main page */}
                <div className="main flex flex-col gap-5 p-6 relative">
                    {/* Top Packages */}
                    <h1 className="text-2xl font-semibold">Top Packages</h1>
                    <div className="my-3 flex flex-wrap relative gap-4">
                        {loadingTop ? (
                            <Loader />
                        ) : topPackages.length === 0 ? (
                            <h1 className="text-center text-2xl">
                                No Packages Yet!
                            </h1>
                        ) : (
                            <>
                                {topPackages.map((packageData, i) => (
                                    <PackageCard
                                        key={i}
                                        packageData={packageData}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                    {/* Latest Packages */}
                    <h1 className="text-2xl font-semibold">Latest Packages</h1>
                    <div className="my-3 flex flex-wrap gap-4 relative">
                        {loadingLatest ? (
                            <Loader />
                        ) : latestPackages.length === 0 ? (
                            <h1 className="text-center text-2xl">
                                No Packages Yet!
                            </h1>
                        ) : (
                            <>
                                {latestPackages.map((packageData, i) => (
                                    <PackageCard
                                        key={i}
                                        packageData={packageData}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                    {/* Best Offers */}
                    <h1 className="text-2xl font-semibold">Best Offers</h1>
                    <div className="my-3 flex flex-wrap gap-4 relative">
                        {loadingOffers ? (
                            <Loader />
                        ) : offerPackages.length === 0 ? (
                            <h1 className="text-center text-2xl">
                                No Packages Yet!
                            </h1>
                        ) : (
                            <>
                                {offerPackages.map((packageData, i) => (
                                    <PackageCard
                                        key={i}
                                        packageData={packageData}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
