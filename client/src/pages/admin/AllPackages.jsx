import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    getPackages as getPackagesApi,
    deletePackage,
} from "../../http/index.js";
import debounce from "../../utils/debounceFunction.js";
import Loader from "../components/shared/Loader.jsx";

const AllPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [resultsPerPage, setResultsPerPage] = useState(10);

    const getPackages = async (page = 0) => {
        setPackages([]);
        try {
            setLoading(true);
            const queryData = {
                searchQuery: `searchTerm=${search}`,
                page: page,
                resultsPerPage: resultsPerPage,
            };
            if (filter === "offer") {
                queryData["offer"] = true;
            } else if (filter === "latest") {
                queryData["sort"] = "createdAt";
            } else if (filter === "top") {
                queryData["sort"] = "packageRating";
            }

            const { data } = await getPackagesApi(queryData);
            if (data?.success) {
                setPackages(data?.packages);
                setTotalPages(
                    Math.ceil(data?.totalResults / data?.resultsPerPage)
                );
            } else {
                alert(data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedGetPackages = useCallback(
        debounce((page) => getPackages(page), 500),
        []
    );

    useEffect(() => {
        debouncedGetPackages(currentPage);
    }, [filter, search, currentPage, resultsPerPage]);

    const handleDelete = async (packageId) => {
        try {
            setLoading(true);
            const data = await deletePackage(packageId);
            alert(data?.message);
            getPackages(currentPage);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="flex w-full flex-col justify-center gap-2 rounded-lg p-5 shadow-xl relative">
                <div className="flex items-center justify-between">
                    <input
                        className="rounded border p-2"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    <select
                        className="rounded border p-2"
                        value={resultsPerPage}
                        onChange={(e) => {
                            setResultsPerPage(Number(e.target.value));
                        }}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className="my-2 border-y-2 py-2">
                    <ul className="flex w-full justify-start gap-4 *:px-4 *:rounded-md">
                        <li
                            className={`cursor-pointer border p-2 transition-all duration-300 hover:scale-95 ${
                                filter === "all" && "bg-blue-500 text-white"
                            }`}
                            id="all"
                            onClick={(e) => setFilter(e.target.id)}>
                            All
                        </li>
                        <li
                            className={`cursor-pointer border p-2 transition-all duration-300 hover:scale-95 ${
                                filter === "offer" && "bg-blue-500 text-white"
                            }`}
                            id="offer"
                            onClick={(e) => setFilter(e.target.id)}>
                            Offer
                        </li>
                        <li
                            className={`cursor-pointer border p-2 transition-all duration-300 hover:scale-95 ${
                                filter === "latest" && "bg-blue-500 text-white"
                            }`}
                            id="latest"
                            onClick={(e) => setFilter(e.target.id)}>
                            Latest
                        </li>
                        <li
                            className={`cursor-pointer border p-2 transition-all duration-300 hover:scale-95 ${
                                filter === "top" && "bg-blue-500 text-white"
                            }`}
                            id="top"
                            onClick={(e) => setFilter(e.target.id)}>
                            Top
                        </li>
                    </ul>
                </div>

                <div className="relative min-h-24 flex flex-col gap-3">
                    {loading && <Loader />}
                    {packages ? (
                        <>
                            {packages.map((pack, i) => (
                                <div
                                    className=" hover:bg-gray-600/10 flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-300 cursor-pointer"
                                    key={i}>
                                    <div className="flex items-center justify-start gap-3">
                                        <span>{i + 1}</span>
                                        <Link to={`/package/${pack._id}`}>
                                            <img
                                                src={pack?.packageImages[0]}
                                                alt="image"
                                                className="h-20 w-20 rounded"
                                            />
                                        </Link>
                                    </div>
                                    <Link to={`/package/${pack._id}`}>
                                        <p className="font-semibold hover:underline">
                                            {pack?.packageName}
                                        </p>
                                    </Link>
                                    <div className="flex flex-row gap-2 items-center ">
                                        <Link
                                            to={`/profile/admin/update-package/${pack._id}`}>
                                            <button
                                                disabled={loading}
                                                className="text-blue-600 border-blue-600 bg-blue-600/15 hover:underline px-3 py-1 rounded-md border">
                                                {loading
                                                    ? "Loading..."
                                                    : "Edit"}
                                            </button>
                                        </Link>
                                        <button
                                            disabled={loading}
                                            onClick={() =>
                                                handleDelete(pack?._id)
                                            }
                                            className="text-red-600 border-red-600 bg-red-600/15 hover:underline px-3 py-1 rounded-md border">
                                            {loading ? "Loading..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* pagination */}
                            {!loading && (
                                <div className="flex justify-center mt-4">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => (
                                            <button
                                                key={index}
                                                className={`mx-1 px-3 py-1 border rounded ${
                                                    currentPage === index
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white"
                                                }`}
                                                onClick={() =>
                                                    handlePageChange(index)
                                                }>
                                                {index + 1}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <h1 className="text-center text-2xl">
                            No Packages Yet!
                        </h1>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllPackages;
