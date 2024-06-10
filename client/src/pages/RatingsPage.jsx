import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingCard from "./RatingCard";
import { getRatings as getRatingApi, getAverageRating } from "../http";

const RatingsPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [packageRatings, setPackageRatings] = useState([]);
    const [showRatingStars, setShowRatingStars] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [loading, setLoading] = useState(false);

    const getRatings = async () => {
        try {
            setLoading(true);
            // Make request to get ratings
            const packageId = params.id;
            const reqData = {
                packageId: packageId,
                searchQuery: "999999999999",
            };
            const { data } = await getRatingApi(reqData);
            // Make request to get average rating
            const { data2 } = await getAverageRating(packageId);
            if (data && data2) {
                setPackageRatings(data);
                setShowRatingStars(data2.rating);
                setTotalRatings(data2.totalRatings);
                setLoading(false);
            } else {
                setPackageRatings("No ratings yet!");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (params.id) getRatings();
    }, [params.id]);

    return (
        <div className="w-full p-3">
            <div className="w-full">
                {loading && (
                    <h1 className="text-center text-2xl">Loading...</h1>
                )}
                {!loading && !packageRatings && (
                    <h1 className="text-center text-2xl">No Ratings Found!</h1>
                )}
                {!loading && packageRatings && (
                    <div className="flex w-full flex-col gap-2 p-2">
                        <h1 className="mb-2 flex items-center">
                            Rating:
                            <Rating
                                size="large"
                                value={showRatingStars || 0}
                                readOnly
                                precision={0.1}
                            />
                            ({totalRatings})
                        </h1>
                        <button
                            onClick={() => navigate(`/package/${params?.id}`)}
                            className="w-min rounded border p-2 py-1 hover:bg-slate-500 hover:text-white">
                            Back
                        </button>
                        <hr />
                        <div className="flex w-full flex-wrap justify-center gap-2 p-2">
                            <RatingCard packageRatings={packageRatings} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingsPage;
