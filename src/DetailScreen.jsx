import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const API_URL =
  "https://api.sheety.co/ae021e3452f9692ed18653ea7a2c7526/pickupdata/sheet1";

const fetchRowByAWB = async (awbNumber) => {
  try {
    const response = await axios.get(API_URL);
    const allUsers = response.data.sheet1;
    const matchedUser = allUsers.find((user) => user.awbNumber === awbNumber);
    return matchedUser;
  } catch (error) {
    console.error("Error fetching row by AWB number:", error);
    return null;
  }
};

const updateRowByID = async (rowId, updatedFields) => {
  try {
    const response = await fetch(`${API_URL}/${rowId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheet1: {
          ...updatedFields,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update the row. Status: ${response.status}. Error: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(data);
    console.log("Row updated successfully");
  } catch (error) {
    console.error("Error updating row:", error);
  }
};

function DetailScreen() {
  const { awbNumber } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [actualWeight, setActualWeight] = useState("");
  const [actualNumPackages, setActualNumPackages] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const matchedUser = await fetchRowByAWB(awbNumber);
      if (matchedUser) {
        setUser(matchedUser);
      } else {
        console.error("No user found with the given AWB number");
      }
    };

    fetchUserData();
  }, [awbNumber]);

  const handleSubmit = async () => {
    if (user && user.id) {
      const details = {
        actualWeight: actualWeight,
        actualNoOfPackages: actualNumPackages,
        status: "PAYMENT PENDING",
      };

      await updateRowByID(user.id, details);

      setActualWeight("");
      setActualNumPackages("");

      navigate("/Home");
    } else {
      console.error("Cannot update row: User or Row ID is missing");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Outgoing Manifest
        </h1>
        <div className="mb-4">
          <div className="text-sm text-gray-600">AWB Number:</div>
          <div className="text-lg text-gray-800">{user.awbNumber}</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Name:</div>
          <div className="text-lg text-gray-800">{user.name}</div>
        </div>
        <div className="mb-4 flex items-center">
          <div className="text-sm text-gray-600">Weight (Approx):</div>
          <div className="ml-2 text-lg text-gray-800">{user.weightapx}</div>
          <FaCheckCircle className="ml-2 text-green-500" />
        </div>
        <div className="mb-4 flex items-center">
          <div className="text-sm text-gray-600">Post Pickup Weight:</div>
          <div className="ml-2 text-lg text-gray-800">
            {user.postPickupWeight}
          </div>
          <FaCheckCircle className="ml-2 text-green-500" />
        </div>
        <div className="mb-4 flex items-center">
          <div className="text-sm text-gray-600">Post-Pickup Packages:</div>
          <div className="ml-2 text-lg text-gray-800">
            {user.postNumberOfPackages}
          </div>
          <FaCheckCircle className="ml-2 text-green-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">
            Actual Weight:
          </label>
          <input
            type="number"
            value={actualWeight}
            onChange={(e) => setActualWeight(e.target.value)}
            placeholder="Enter actual weight"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Actual Number of Packages:
          </label>
          <input
            type="number"
            value={actualNumPackages}
            onChange={(e) => setActualNumPackages(e.target.value)}
            placeholder="Enter number of packages"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DetailScreen;