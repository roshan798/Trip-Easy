import { useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";
import { getPackages } from "../http";
import Loader from "./components/shared/Loader";

const Home = () => {
    const navigate = useNavigate();
    const [topPackages, setTopPackages] = useState([]);
    const [latestPackages, setLatestPackages] = useState([]);
    const [offerPackages, setOfferPackages] = useState([]);
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingLatest, setLoadingLatest] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [search, setSearch] = useState("");

    const getTopPackages = async () => {
        try {
            setLoadingTop(true);
            const { data } = await getPackages({
                sortBy: "packageRating",
                resultsPerPage: 12,
            });
            if (data?.success) {
                setTopPackages(data?.packages);
            } else {
                alert(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTop(false);
        }
    };

    const getLatestPackages = async () => {
        try {
            setLoadingLatest(true);
            const { data } = await getPackages({
                sortBy: "createdAt",
                resultsPerPage: 12,
            });
            if (data?.success) {
                setLatestPackages(data?.packages);
            } else {
                alert(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingLatest(false);
        }
    };

    const getOfferPackages = async () => {
        try {
            setLoadingOffers(true);
            const { data } = await getPackages({
                sortBy: "createdAt",
                resultsPerPage: 12,
                offer: true,
            });
            if (data?.success) {
                setOfferPackages(data?.packages);
            } else {
                alert(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingOffers(false);
        }
    };

    useEffect(() => {
        const helper =  () => {
            getTopPackages();
            getLatestPackages();
            getOfferPackages();
        };
        helper();
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
                    <div className="my-3 flex flex-wrap gap-2 relative">
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
                    <div className="my-3 flex flex-wrap gap-2 relative">
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
                    <div className="my-3 flex flex-wrap gap-2 relative">
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
