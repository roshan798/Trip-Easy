import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="w-max">
      <div className="flex flex-col items-center overflow-hidden rounded border bg-white p-3 shadow-md">
        <img
          className="h-[190px] w-[300px] rounded border transition-all duration-300 hover:scale-110"
          src={packageData.packageImages[0]}
          alt="Package Image"
        />
        <div className="my-2 flex w-full flex-col">
          <p className="xsm:w-[250px] w-[90%] text-lg font-semibold capitalize">
            {packageData.packageName}
          </p>
          <p className="text-lg capitalize text-green-700">
            {packageData.packageDestination}
          </p>
          {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
            <p className="flex items-center gap-2 text-lg">
              <FaClock />
              {+packageData.packageDays > 0 &&
                (+packageData.packageDays > 1
                  ? packageData.packageDays + " Days"
                  : packageData.packageDays + " Day")}
              {+packageData.packageDays > 0 &&
                +packageData.packageNights > 0 &&
                " - "}
              {+packageData.packageNights > 0 &&
                (+packageData.packageNights > 1
                  ? packageData.packageNights + " Nights"
                  : packageData.packageNights + " Night")}
            </p>
          )}
          {/* price & rating */}
          <div className="flex flex-wrap justify-between">
            {packageData.packageTotalRatings > 0 && (
              <p className="flex items-center text-lg">
                <Rating
                  value={packageData.packageRating}
                  size="medium"
                  readOnly
                  precision={0.1}
                />
                ({packageData.packageTotalRatings})
              </p>
            )}
            {packageData.offer && packageData.packageDiscountPrice ? (
              <p className="flex gap-1">
                <span className="text-gray-700 line-through">
                  ${packageData.packagePrice}
                </span>
                -
                <span className="font-medium text-green-700">
                  ${packageData.packageDiscountPrice}
                </span>
              </p>
            ) : (
              <p className="font-medium text-green-700">
                ${packageData.packagePrice}
              </p>
            )}
          </div>
          {/* price & rating */}
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
