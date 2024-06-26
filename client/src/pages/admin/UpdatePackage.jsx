import { useEffect, useState } from "react";
import { app } from "../../firebase";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router";
import { getPackage, updatePackage } from "../../http";
import { useNotification } from "../../hooks/useNotification";

const UpdatePackage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const notify = useNotification();
    const [formData, setFormData] = useState({
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
    });
    const [images, setImages] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUploadPercent, setImageUploadPercent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getPackageData = async () => {
            try {
                const reqData = {
                    packageId: params.id,
                };
                const { data } = await getPackage(reqData);
                if (data?.success) {
                    // console.log(data);
                    setFormData({
                        packageName: data?.packageData?.packageName,
                        packageDescription:
                            data?.packageData?.packageDescription,
                        packageDestination:
                            data?.packageData?.packageDestination,
                        packageDays: data?.packageData?.packageDays,
                        packageNights: data?.packageData?.packageNights,
                        packageAccommodation:
                            data?.packageData?.packageAccommodation,
                        packageTransportation:
                            data?.packageData?.packageTransportation,
                        packageMeals: data?.packageData?.packageMeals,
                        packageActivities: data?.packageData?.packageActivities,
                        packagePrice: data?.packageData?.packagePrice,
                        packageDiscountPrice:
                            data?.packageData?.packageDiscountPrice,
                        packageOffer: data?.packageData?.packageOffer,
                        packageImages: data?.packageData?.packageImages,
                    });
                } else {
                    notify(data?.message || "Something went wrong!", "error");
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (params.id) getPackageData();
    }, [params, params.id]);

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
                    console.log(formData);
                    setImageUploadError(false);
                    setUploading(false);
                    notify(
                        "Images uploaded successfully! Click on update Package",
                        "success"
                    );
                })
                .catch((err) => {
                    setImageUploadError(
                        "Image upload failed (2mb max per image)"
                    );
                    setUploading(false);
                    notify(
                        "Image upload failed (2mb max per image)",
                        "warning"
                    );
                });
        } else {
            setImageUploadError("You can only upload 5 images per package");
            setUploading(false);
            notify("You can only upload 5 images per package", "warning");
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
                            return resolve(downloadURL);
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
        notify("Image deleted successfully!", "success");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.packageImages.length === 0) {
            notify("You must upload at least 1 image", "error");
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
            notify("All fields are required!", "error");
            return;
        }
        if (formData.packagePrice < 500) {
            notify("Price should be greater than 500!", "error");
            return;
        }
        if (formData.packageDiscountPrice >= formData.packagePrice) {
            notify(
                "Regular Price should be greater than Discount Price!",
                "error"
            );
            return;
        }
        if (formData.packageOffer === false) {
            setFormData({ ...formData, packageDiscountPrice: 0 });
        }
        try {
            setLoading(true);
            setError(false);
            const data = await updatePackage({
                packageId: params?.id,
                formData,
            });
            if (data?.success === false) {
                setError(data?.message);
                setLoading(false);
                notify(data?.message, "error");
            } else {
                setLoading(false);
                setError(false);
                notify(
                    data?.message || "Package updated successfully",
                    "success"
                );
                navigate(`/package/${params?.id}`);
            }
        } catch (err) {
            console.log(err);
            notify("An error occurred while updating the package.", "error");
        }
    };

    return (
        <>
            <div className="flex w-full flex-wrap justify-center gap-2 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full flex-col items-center gap-2 rounded-xl p-3 shadow-md sm:w-[60%]">
                    <h1 className="text-center text-2xl font-semibold">
                        Update Package
                    </h1>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageName">Name:</label>
                        <input
                            type="text"
                            className="rounded border border-black"
                            id="packageName"
                            value={formData?.packageName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageDescription">Description:</label>
                        <textarea
                            type="text"
                            className="resize-none rounded border border-black"
                            id="packageDescription"
                            value={formData.packageDescription}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageDestination">Destination:</label>
                        <input
                            type="text"
                            className="rounded border border-black"
                            id="packageDestination"
                            value={formData.packageDestination}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-wrap gap-2">
                        <div className="flex flex-1 flex-col">
                            <label htmlFor="packageDays">Days:</label>
                            <input
                                type="number"
                                className="rounded border border-black"
                                id="packageDays"
                                value={formData.packageDays}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <label htmlFor="packageNights">Nights:</label>
                            <input
                                type="number"
                                className="rounded border border-black"
                                id="packageNights"
                                value={formData.packageNights}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageAccommodation">
                            Accommodation:
                        </label>
                        <textarea
                            type="text"
                            className="resize-none rounded border border-black"
                            id="packageAccommodation"
                            value={formData.packageAccommodation}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageTransportation">
                            Transportation:(Selected:
                            {formData?.packageTransportation})
                        </label>
                        <select
                            className="rounded-lg border border-black"
                            id="packageTransportation"
                            onChange={handleChange}>
                            <option value={formData?.packageTransportation}>
                                Select
                            </option>
                            <option>Flight</option>
                            <option>Train</option>
                            <option>Boat</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageMeals">Meals:</label>
                        <textarea
                            type="text"
                            className="resize-none rounded border border-black"
                            id="packageMeals"
                            value={formData.packageMeals}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageActivities">Activities:</label>
                        <textarea
                            type="text"
                            className="resize-none rounded border border-black"
                            id="packageActivities"
                            value={formData.packageActivities}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <label htmlFor="packagePrice">Price:</label>
                        <input
                            type="number"
                            className="rounded border border-black"
                            id="packagePrice"
                            value={formData.packagePrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full items-center gap-2">
                        <label htmlFor="packageOffer">Offer:</label>
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border border-black"
                            id="packageOffer"
                            checked={formData?.packageOffer}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        className={`${
                            formData.packageOffer
                                ? "flex w-full flex-col"
                                : "hidden"
                        }`}>
                        <label htmlFor="packageDiscountPrice">
                            Discount Price:
                        </label>
                        <input
                            type="number"
                            className="rounded border border-black"
                            id="packageDiscountPrice"
                            value={formData.packageDiscountPrice}
                            onChange={handleChange}
                        />
                    </div>
                    {imageUploadError ||
                        (error && (
                            <span className="w-full text-red-600">
                                {imageUploadError || error}
                            </span>
                        ))}
                    <button
                        disabled={uploading || loading}
                        className="w-full rounded bg-green-700 p-3 text-white hover:opacity-95 disabled:opacity-80">
                        {uploading
                            ? "Uploading..."
                            : loading
                            ? "Loading..."
                            : "Update Package"}
                    </button>
                </form>
                <div className="flex h-max w-full flex-col gap-2 rounded-xl p-3 shadow-md sm:w-[30%]">
                    <div className="flex w-full flex-col">
                        <label htmlFor="packageImages">
                            Images:
                            <span className="text-sm text-red-700">
                                (images size should be less than 2mb and max 5
                                images)
                            </span>
                        </label>
                        <input
                            type="file"
                            className="rounded border border-black"
                            id="packageImages"
                            multiple
                            onChange={(e) => setImages(e.target.files)}
                        />
                    </div>
                    {formData?.packageImages?.length > 0 && (
                        <div className="flex w-full flex-col justify-center p-3">
                            {formData.packageImages.map((image, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="my-2 flex flex-wrap justify-between rounded-lg p-1 shadow-xl">
                                        <img
                                            src={image}
                                            alt=""
                                            className="h-20 w-20 rounded"
                                        />
                                        <button
                                            onClick={() => handleDeleteImage(i)}
                                            className="p-2 text-red-500 hover:cursor-pointer hover:underline">
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <button
                        disabled={uploading || loading || images.length === 0}
                        className="w-full rounded bg-green-700 p-3 text-white hover:opacity-95 disabled:opacity-80"
                        type="button"
                        onClick={handleImageSubmit}>
                        {uploading
                            ? `Uploading...(${imageUploadPercent}%)`
                            : loading
                            ? "Loading..."
                            : "Upload Images"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default UpdatePackage;
