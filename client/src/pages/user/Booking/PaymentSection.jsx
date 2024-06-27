import DropIn from "braintree-web-drop-in-react";

const PaymentSection = ({
  clientToken,
  instance,
  setInstance,
  handleBookPackage,
  loading,
  currentUser,
}) => {
  return (
    <div className="my-2 max-w-[300px] gap-1">
      <p className={`font-semibold ${instance && "text-sm text-red-700"}`}>
        Payment:{" "}
        {!instance
          ? "Loading..."
          : "Don't use your original card details! (This is not the production build)"}
      </p>
      {clientToken && (
        <>
          <DropIn
            options={{
              authorization: clientToken,
            }}
            onInstance={(instance) => setInstance(instance)}
          />
          <button
            className="payment-btn disabled:optional:80 cursor-pointer rounded bg-blue-600 p-2 text-white hover:opacity-95"
            onClick={handleBookPackage}
            disabled={loading || !instance || !currentUser?.address}
          >
            {loading ? "Processing..." : "Book Now"}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSection;
