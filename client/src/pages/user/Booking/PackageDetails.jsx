import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const PackageDetails = ({
  packageData,
  bookingData,
  setBookingData,
  currentDate,
}) => {
  return (
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
              <FaMapMarkerAlt /> {packageData.packageDestination}
            </p>
            {(packageData.packageDays > 0 || packageData.packageNights > 0) && (
              <p className="flex items-center gap-2">
                <FaClock />
                {packageData.packageDays > 0 && (
                  <>
                    {packageData.packageDays} Day
                    {packageData.packageDays > 1 && "s"}
                  </>
                )}
                {packageData.packageDays > 0 &&
                  packageData.packageNights > 0 &&
                  " - "}
                {packageData.packageNights > 0 && (
                  <>
                    {packageData.packageNights} Night
                    {packageData.packageNights > 1 && "s"}
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="my-1 flex flex-col">
          <label className="font-semibold" htmlFor="date">
            Select Date:
          </label>
          <input
            type="date"
            min={currentDate}
            id="date"
            className="w-max rounded border"
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                date: e.target.value,
              })
            }
          />
        </div>
        <p className="my-1 flex gap-1 text-xl font-semibold">
          Price:
          {packageData.packageOffer ? (
            <>
              <span className="text-gray-700 line-through">
                &#8377;{packageData.packagePrice}
              </span>{" "}
              -<span>&#8377; {packageData.packageDiscountPrice}</span>
              <span className="ml-2 rounded bg-green-700 p-1 text-lg text-white">
                {Math.floor(
                  ((packageData.packagePrice -
                    packageData.packageDiscountPrice) /
                    packageData.packagePrice) *
                    100,
                )}
                % Off
              </span>
            </>
          ) : (
            <span className="text-green-700">
              &#8377;{packageData.packagePrice}
            </span>
          )}
        </p>
        <div className="flex w-max border-2">
          <button
            className="p-2 py-1 font-semibold"
            onClick={() => {
              if (bookingData.persons > 1) {
                setBookingData((prevData) => ({
                  ...prevData,
                  persons: prevData.persons - 1,
                  totalPrice: packageData.packageDiscountPrice
                    ? packageData.packageDiscountPrice * (prevData.persons - 1)
                    : packageData.packagePrice * (prevData.persons - 1),
                }));
              }
            }}
          >
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
                setBookingData((prevData) => ({
                  ...prevData,
                  persons: prevData.persons + 1,
                  totalPrice: packageData.packageDiscountPrice
                    ? packageData.packageDiscountPrice * (prevData.persons + 1)
                    : packageData.packagePrice * (prevData.persons + 1),
                }));
              }
            }}
          >
            +
          </button>
        </div>
        <p className="text-xl font-semibold">
          Total Price:{" "}
          <span className="text-green-700">
            &#8377;{bookingData.totalPrice}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PackageDetails;
