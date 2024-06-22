import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPackages as getPackagesAPi } from "../../http";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let queryParams = {
        searchQuery: `searchTerm=${search}`,
        sortBy: filter === "most" ? "packageTotalRatings" : "packageRating",
      };
      const { data } = await getPackagesAPi(queryParams);
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      if (data?.packages?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const queryParams = {
      searchQuery: `searchTerm=${search}`,
      sortBy: filter === "most" ? "packageTotalRatings" : "packageRating",
      startIndex: numberOfPackages,
    };
    const { data } = await getPackagesAPi(queryParams);
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-2 rounded-lg p-5 shadow-xl">
        {loading && <h1 className="text-center text-lg">Loading...</h1>}
        {packages && (
          <>
            <div>
              <input
                className="rounded border p-2"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="my-2 border-y-2 py-2">
              <ul className="flex w-full justify-around">
                <li
                  className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                    filter === "all" && "bg-blue-500 text-white"
                  }`}
                  id="all"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  All
                </li>
                <li
                  className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                    filter === "most" && "bg-blue-500 text-white"
                  }`}
                  id="most"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  Most Rated
                </li>
              </ul>
            </div>
          </>
        )}
        {/* packages */}
        {packages ? (
          packages.map((pack, i) => {
            return (
              <div
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border p-3 transition-all duration-300 hover:scale-[1.02]"
                key={i}
              >
                <Link to={`/package/ratings/${pack._id}`}>
                  <img
                    src={pack?.packageImages[0]}
                    alt="image"
                    className="h-20 w-20 rounded"
                  />
                </Link>
                <Link to={`/package/ratings/${pack._id}`}>
                  <p className="font-semibold hover:underline">
                    {pack?.packageName}
                  </p>
                </Link>
                <p className="flex items-center">
                  <Rating
                    value={pack?.packageRating}
                    precision={0.1}
                    readOnly
                  />
                  ({pack?.packageTotalRatings})
                </p>
              </div>
            );
          })
        ) : (
          <h1 className="text-center text-2xl">No Ratings Available!</h1>
        )}
        {showMoreBtn && (
          <button
            onClick={onShowMoreSClick}
            className="m-3 w-max rounded bg-green-700 p-2 text-center text-sm text-white hover:underline"
          >
            Show More
          </button>
        )}
      </div>
    </>
  );
};

export default RatingsReviews;
