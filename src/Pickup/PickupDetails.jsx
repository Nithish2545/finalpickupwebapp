import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const API_URL = "https://api.sheety.co/ae021e3452f9692ed18653ea7a2c7526/pickupdata/sheet1";

const PickupDetails = () => {
  const { awbnumber } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickupWeight, setPickupWeight] = useState("");
  const [numberOfPackages, setNumberOfPackages] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [packageWeightImages, setPackageWeightImages] = useState([]);
  const [formImages, setFormImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [formError, setFormError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(API_URL);
        const userDetails = result.data.sheet1.find(
          (item) => item.status === "RUN SHEET" && item.awbNumber === awbnumber
        );
        setDetails(userDetails);
        setPickupWeight(userDetails?.pickupWeight || "");
        setNumberOfPackages(userDetails?.numberOfPackages || "");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [awbnumber]);

  const uploadFileToFirebase = async (file, folder) => {
    const storageRef = ref(storage, `${awbnumber}/${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleFileChange = (event, setState, maxFiles, currentFiles) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length + currentFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    setState((prevFiles) => [...prevFiles, ...newFiles]);
    setInputKey(Date.now());
  };

  const handleRemoveFile = (fileName, setState) => {
    setState((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const validateForm = () => {
    if (!pickupWeight || !numberOfPackages) {
      setFormError("Pickup weight and number of packages are required.");
      return false;
    }
    if (productImages.length === 0 || productImages.length > 5) {
      setFormError("You must upload between 1 to 5 product images.");
      return false;
    }
    if (packageWeightImages.length === 0 || packageWeightImages.length > 5) {
      setFormError("You must upload between 1 to 5 package weight images.");
      return false;
    }
    if (formImages.length === 0 || formImages.length > 2) {
      setFormError("You must upload between 1 to 2 form images.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      if (!details) {
        throw new Error("User details not found");
      }

      const productImageUrls = await Promise.all(
        productImages.map((file) => uploadFileToFirebase(file, "PRODUCT IMAGES"))
      );
      const packageWeightImageUrls = await Promise.all(
        packageWeightImages.map((file) => uploadFileToFirebase(file, "PACKAGE WEIGHT"))
      );
      const formImageUrls = await Promise.all(
        formImages.map((file) => uploadFileToFirebase(file, "FORM IMAGES"))
      );

      await axios.put(`${API_URL}/${details.id}`, {
        sheet1: {
          postPickupWeight: `${pickupWeight} KG`,
          postNumberOfPackages: numberOfPackages,
          status: "OUTGOING MANIFEST",
          PRODUCTSIMAGE: productImageUrls.join(", "),
          PACKAGEWEIGHTIMAGES: packageWeightImageUrls.join(", "),
          FORMIMAGES: formImageUrls.join(", "),
        },
      });

      navigate("/home");
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitLoading(false);
      resetForm(); // Reset form after submission
    }
  };

  const handleError = (error) => {
    if (error.response) {
      setError(`Error ${error.response.status}: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      setError("Network error. Please check your connection.");
    } else {
      setError(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setPickupWeight("");
    setNumberOfPackages("");
    setProductImages([]);
    setPackageWeightImages([]);
    setFormImages([]);
    setInputKey(Date.now());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-purple-600"
          role="status"
        >
          <span className="visually-hidden">...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {details ? (
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Pickup Details</h1>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">AWB Number:</span>
                <span className="text-gray-800">{details.awbNumber}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Consignee:</span>
                <span className="text-gray-800">{details.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Destination:</span>
                <span className="text-gray-800">{details.destination}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Weight APX:</span>
                <span className="text-gray-800">{details.weightapx}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Phone Number:</span>
                <span className="text-gray-800">{details.phoneNumber}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Pickup DateTime:</span>
                <span className="text-gray-800">{details.pickupDatetime}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Pickup Inst:</span>
                <span className="text-gray-800">{details.pickupInstructions || "-"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Details</h2>
            <div className="flex flex-col mb-4">
              <label htmlFor="pickupWeight" className="text-gray-700 font-medium mb-1">
                Pickup Weight (KG):
              </label>
              <input
                type="text"
                id="pickupWeight"
                value={pickupWeight}
                onChange={(e) => setPickupWeight(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="numberOfPackages" className="text-gray-700 font-medium mb-1">
                Number of Packages:
              </label>
              <input
                type="text"
                id="numberOfPackages"
                value={numberOfPackages}
                onChange={(e) => setNumberOfPackages(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <FileInput
              label="Product Images (1-5)"
              accept="image/*"
              key={`product-${inputKey}`}
              files={productImages}
              setFiles={setProductImages}
              maxFiles={5}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />

            <FileInput
              label="Package Weight Images (1-5)"
              accept="image/*"
              key={`weight-${inputKey}`}
              files={packageWeightImages}
              setFiles={setPackageWeightImages}
              maxFiles={5}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />

            <FileInput
              label="Form Images (1-2)"
              accept="image/*"
              key={`form-${inputKey}`}
              files={formImages}
              setFiles={setFormImages}
              maxFiles={2}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <button
              type="submit"
              className="w-full mt-4 p-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-500">No details found for the given AWB number.</div>
      )}
    </div>
  );
};

const FileInput = ({ label, accept, files, setFiles, maxFiles, handleFileChange, handleRemoveFile }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-700 font-medium mb-1">{label}:</label>
      <input
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFileChange(e, setFiles, maxFiles, files)}
        className="mb-2"
      />
      {files.map((file, index) => (
        <div key={index} className="flex items-center mb-1">
          <p className="text-gray-600 mr-2">{file.name}</p>
          <button
            type="button"
            onClick={() => handleRemoveFile(file.name, setFiles)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default PickupDetails;
