const UserDetails = ({ currentUser }) => {
    return (
        <div className="pr-3 md:border-r md:pr-6">
            <div className="xsm:w-72 flex h-fit w-64 flex-col gap-2 p-2">
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="username"
                        className="font-semibold mb-1">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                        value={currentUser.username}
                        disabled
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="email"
                        className="font-semibold mb-1">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                        value={currentUser.email}
                        disabled
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="address"
                        className="font-semibold mb-1">
                        Address:
                    </label>
                    <textarea
                        maxLength={200}
                        type="text"
                        id="address"
                        className="resize-none rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                        value={currentUser.address}
                        disabled
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="phone"
                        className="font-semibold mb-1">
                        Phone:
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                        value={currentUser.phone}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
