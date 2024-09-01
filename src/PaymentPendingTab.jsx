import React from "react";

const PaymentPendingTab = ({ userData = [], handleAssignmentChange, handleCardPress, handleOpenMap, pickupPersons = [] }) => {
  
  if (!Array.isArray(userData)) {
    return <p>No data available.</p>;
  }

  console.log(userData)
  return (
    <div>
      {userData.map((user, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
        >
          <div className="mb-4">
            <div
              className={`bg-${user.STATUS === "PENDING" ? "red" : user.STATUS === "COMPLETED" ? "green" : "gray"}-200 p-2 rounded text-${user.STATUS === "PENDING" ? "red" : user.STATUS === "COMPLETED" ? "green" : "gray"}-800`}
            >
              {user.STATUS}
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-800">AWB No:</span>
              <span className="text-gray-700">{user.AWB_NUMBER || ""}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-800">Actual Weight:</span>
              <span className="text-gray-700">{user.ACTUAL_WEIGHT || ""}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-800">Vendor Name:</span>
              <span className="text-gray-700">{user.VENDOR_NAME || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Consignee:</span>
              <span className="text-gray-700">{user.NAME || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Destination:</span>
              <span className="text-gray-700">{user.DESTINATION || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Coordinates:</span>
              <button
                className="bg-purple-500 text-white px-2 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card press when opening the map
                  handleOpenMap(user.LATITUDE, user.LONGITUDE);
                }}
              >
                View on Map
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentPendingTab;