import { useState } from "react";
import { app } from "../../firebase";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { createPackage } from "../../http";
import { useNotification } from "../components/Notification/NotificationContext";

const AddPackages = () => {
    const defaultFormData = {
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
    };
    const [formData, setFormData] = useState(defaultFormData);
    const [images, setImages] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUploadPercent, setImageUploadPercent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const notify = useNotification();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (e.target.type === "checkbox") {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }
    };

    const handleImageSubmit = () => {
        if (
            images.length > 0 &&
            images.length + formData.packageImages.length < 6
        ) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < images.length; i++) {
                promises.push(storeImage(images[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        packageImages: formData.packageImages.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError(
                        "Image upload failed (2mb max per image)"
                    );
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 5 images per package");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, `package-photos/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadPercent(Math.floor(progress));
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            packageImages: formData.packageImages.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.packageImages.length === 0) {
            notify("You must upload at least 1 image", "warning");
            return;
        }
        if (
            formData.packageName === "" ||
            formData.packageDescription === "" ||
            formData.packageDestination === "" ||
            formData.packageAccommodation === "" ||
            formData.packageTransportation === "" ||
            formData.packageMeals === "" ||
            formData.packageActivities === "" ||
            formData.packagePrice === 0
        ) {
            notify("All fields are required!", "warning");
            return;
        }
        if (formData.packagePrice < 0) {
            notify("Price should be greater than 500!", "warning");
            return;
        }
        if (formData.packageDiscountPrice >= formData.packagePrice) {
            notify(
                "Regular Price should be greater than Discount Price!",
                "warning"
            );
            return;
        }
        if (formData.packageOffer === false) {
            setFormData({ ...formData, packageDiscountPrice: 0 });
        }

        try {
            setLoading(true);
            setError(false);
            const { data } = await createPackage(formData);
            if (data?.success === false) {
                setError(data?.message);
            }
            setError(false);
            notify(data?.message, "success");
            setFormData(defaultFormData);
            setImages([]);
        } catch (err) {
            console.log(err);
            notify(err.message || "something wrong happened!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-lg">
                <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6">
                    Add Package
                </h1>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageName"
                        className="mb-2 font-medium text-gray-700">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageName"
                        value={formData.packageName}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageDescription"
                        className="mb-2 font-medium text-gray-700">
                        Description:
                    </label>
                    <textarea
                        type="text"
                        className="resize-none rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageDescription"
                        value={formData.packageDescription}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageDestination"
                        className="mb-2 font-medium text-gray-700">
                        Destination:
                    </label>
                    <input
                        type="text"
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageDestination"
                        value={formData.packageDestination}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-wrap gap-4">
                    <div className="flex flex-1 flex-col">
                        <label
                            htmlFor="packageDays"
                            className="mb-2 font-medium text-gray-700">
                            Days:
                        </label>
                        <input
                            type="number"
                            className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                            id="packageDays"
                            value={formData.packageDays}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <label
                            htmlFor="packageNights"
                            className="mb-2 font-medium text-gray-700">
                            Nights:
                        </label>
                        <input
                            type="number"
                            className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                            id="packageNights"
                            value={formData.packageNights}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageAccommodation"
                        className="mb-2 font-medium text-gray-700">
                        Accommodation:
                    </label>
                    <textarea
                        type="text"
                        className="resize-none rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageAccommodation"
                        value={formData.packageAccommodation}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageTransportation"
                        className="mb-2 font-medium text-gray-700">
                        Transportation:
                    </label>
                    <select
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageTransportation"
                        onChange={handleChange}>
                        {[
                            "select",
                            "Flight",
                            "train",
                            "Boat",
                            "Bus",
                            "Others",
                        ].map((opt) => (
                            <option
                                key={opt}
                                value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageMeals"
                        className="mb-2 font-medium text-gray-700">
                        Meals:
                    </label>
                    <textarea
                        type="text"
                        className="resize-none rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageMeals"
                        value={formData.packageMeals}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageActivities"
                        className="mb-2 font-medium text-gray-700">
                        Activities:
                    </label>
                    <textarea
                        type="text"
                        className="resize-none rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageActivities"
                        value={formData.packageActivities}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packagePrice"
                        className="mb-2 font-medium text-gray-700">
                        Price:
                    </label>
                    <input
                        type="number"
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packagePrice"
                        value={formData.packagePrice}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full items-center gap-2">
                    <label
                        htmlFor="packageOffer"
                        className="font-medium text-gray-700">
                        Offer:
                    </label>
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-gray-300 text-indigo-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        id="packageOffer"
                        checked={formData.packageOffer}
                        onChange={handleChange}
                    />
                </div>
                <div
                    className={`${
                        formData.packageOffer
                            ? "flex w-full flex-col"
                            : "hidden"
                    }`}>
                    <label
                        htmlFor="packageDiscountPrice"
                        className="mb-2 font-medium text-gray-700">
                        Discount Price:
                    </label>
                    <input
                        type="number"
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageDiscountPrice"
                        value={formData.packageDiscountPrice}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <label
                        htmlFor="packageImages"
                        className="mb-2 font-medium text-gray-700">
                        Images:
                        <span className="block text-sm text-red-700">
                            (images size should be less than 2mb and max 5
                            images)
                        </span>
                    </label>
                    <input
                        type="file"
                        className="rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                        id="packageImages"
                        multiple
                        onChange={(e) => setImages(e.target.files)}
                    />
                </div>
                {imageUploadError ||
                    (error && (
                        <span className="w-full text-red-600">
                            {imageUploadError || error}
                        </span>
                    ))}
                <button
                    hidden={images.length === 0}
                    disabled={uploading || loading}
                    className="w-full rounded bg-indigo-600 p-3 text-white hover:opacity-95 disabled:opacity-80"
                    type="button"
                    onClick={handleImageSubmit}>
                    {uploading
                        ? `Uploading...(${imageUploadPercent}%)`
                        : loading
                        ? "Loading..."
                        : "Upload Images"}
                </button>
                <button
                    disabled={uploading || loading}
                    className="w-full rounded bg-indigo-600 p-3 text-white hover:opacity-95 disabled:opacity-80">
                    {uploading
                        ? "Uploading..."
                        : loading
                        ? "Loading..."
                        : "Add Package"}
                </button>
                {formData.packageImages.length > 0 && (
                    <div className="flex w-full flex-col justify-center p-3">
                        {formData.packageImages.map((image, i) => {
                            return (
                                <div
                                    key={i}
                                    className="my-2 flex flex-wrap justify-between items-center rounded-lg p-1 shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <span className="text-6xl text-gray-400 font-mono font-bold">
                                            {" "}
                                            {i + 1}
                                        </span>{" "}
                                        <img
                                            src={image}
                                            alt="package image"
                                            className="h-20 w-20 rounded"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteImage(i)}
                                        className="py-2 px-3 border h-min text-red-500 rounded border-red-500 bg-red-500/20 hover:cursor-pointer hover:underline">
                                        Delete
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddPackages;
