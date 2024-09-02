import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://api.sheety.co/ae021e3452f9692ed18653ea7a2c7526/pickupdata/sheet1";

const PickupCompleted = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const user = JSON.parse(token);
          setUserRole(user.role);
          setUserName(user.name);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userName) {
      const fetchDetails = async () => {
        try {
          const result = await axios.get(API_URL);
          // Find the details with status 'OUTGOING MANIFEST'
          const completedDetails = result.data.sheet1.filter(
            (item) => item.status === "OUTGOING MANIFEST" && item.pickUpPersonName === userName
          );
          setDetails(completedDetails);
        } catch (error) {
          if (error.response) {
            setError(
              `Error ${error.response.status}: ${
                error.response.data.message || error.message
              }`
            );
          } else if (error.request) {
            setError("Network error. Please check your connection.");
          } else {
            setError(`Error: ${error.message}`);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [userName]); // Depend on userName

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
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Completed Pickup Details
      </h1>
      {details && details.length > 0 ? (
        details.map((detail) => (
          <div
            key={detail.id}
            className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">AWB Number:</span>
                <span className="text-gray-800">{detail.awbNumber}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Consignee:</span>
                <span className="text-gray-800">{detail.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Destination:</span>
                <span className="text-gray-800">{detail.destination}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Weight APX:</span>
                <span className="text-gray-800">{detail.weightapx}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">Phone Number:</span>
                <span className="text-gray-800">{detail.phonenumber}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">
                  Post Pickup Weight:
                </span>
                <span className="text-gray-800">
                  {detail.postPickupWeight || "-"}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-gray-600">
                  Post Number of Packages:
                </span>
                <span className="text-gray-800">
                  {detail.postNumberOfPackages || "-"}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-4 text-gray-800">
          No completed details found.
        </div>
      )}
    </div>
  );
};

export default PickupCompleted;
