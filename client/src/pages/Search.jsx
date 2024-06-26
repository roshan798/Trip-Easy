import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PackageCard from "./PackageCard";
import { getPackages, searchPackage } from "../http";

const RESULT_PER_PAGE = 8;

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sideBarSearchData, setSideBarSearchData] = useState({
        searchTerm: "",
        offer: false,
        sort: "created_at",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [allPackages, setAllPackages] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");

        if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSideBarSearchData({
                searchTerm: searchTermFromUrl || "",
                offer: offerFromUrl === "true" ? true : false,
                sort: sortFromUrl || "created_at",
                order: orderFromUrl || "desc",
            });
        }

        const fetchAllPackages = async () => {
            setLoading(true);

            try {
                const queryParams = {
                    searchTerm: urlParams.get("searchTerm"),
                    page: 1,
                    resultsPerPage: RESULT_PER_PAGE,
                };
                const { data } = await searchPackage(queryParams);

                setAllPackages(data?.packages);
                setTotalResults(data?.totalResults);
                setPage(1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPackages();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSideBarSearchData({
                ...sideBarSearchData,
                searchTerm: e.target.value,
            });
        }
        if (e.target.id === "offer") {
            setSideBarSearchData({
                ...sideBarSearchData,
                [e.target.id]:
                    e.target.checked || e.target.checked === "true"
                        ? true
                        : false,
            });
        }
        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "created_at";
            const order = e.target.value.split("_")[1] || "desc";
            setSideBarSearchData({ ...sideBarSearchData, sort, order });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sideBarSearchData.searchTerm);
        urlParams.set("offer", sideBarSearchData.offer);
        urlParams.set("sort", sideBarSearchData.sort);
        urlParams.set("order", sideBarSearchData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        setLoading(true);
        try {
            const nextPage = page + 1;
            const urlParams = new URLSearchParams(location.search);
            const searchQuery = urlParams.toString();
            const queryParams = {
                searchQuery: searchQuery,
                page: nextPage,
                resultsPerPage: RESULT_PER_PAGE,
            };
            const { data } = await getPackages(queryParams);

            setAllPackages([...allPackages, ...data?.packages]);
            setPage(nextPage);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="border-b-2 md:h-screen md:sticky top-0 left-0 p-7 md:min-h-screen md:border-r-2 md:w-1/3 bg-gray-100">
                <form
                    className="flex flex-col gap-8"
                    onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Search:
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search by Destination, Activity, or Package Name"
                            className="w-full rounded-lg border p-3"
                            value={sideBarSearchData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5 h-5"
                                checked={sideBarSearchData.offer}
                                onChange={handleChange}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <select
                            onChange={handleChange}
                            defaultValue={"created_at_desc"}
                            id="sort_order"
                            className="rounded-lg border p-3 w-full">
                            <option value="packagePrice_desc">
                                Price high to low
                            </option>
                            <option value="packagePrice_asc">
                                Price low to high
                            </option>
                            <option value="packageRating_desc">
                                Top Rated
                            </option>
                            <option value="packageTotalRatings_desc">
                                Most Rated
                            </option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95">
                        Search
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="mt-5 border-b p-3 text-xl font-semibold text-slate-700">
                    Package Results:
                </h1>
                <div className="flex w-full flex-wrap gap-2 p-5">
                    {!loading && allPackages.length === 0 && (
                        <p className="text-xl text-slate-700">
                            No Packages Found!
                        </p>
                    )}

                    {!loading &&
                        allPackages &&
                        allPackages.map((packageData, i) => (
                            <PackageCard
                                key={i}
                                packageData={packageData}
                            />
                        ))}
                    {loading && (
                        <p className="w-full text-center text-xl text-slate-700">
                            Loading...
                        </p>
                    )}
                </div>
                {allPackages.length < totalResults && (
                    <div className="w-full border p-5 flex justify-center">
                        <button
                            onClick={onShowMoreClick}
                            className="w-max rounded bg-green-700 p-2 text-center text-sm text-white hover:underline">
                            Show More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
