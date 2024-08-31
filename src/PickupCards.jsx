import React from 'react';

const PickupCards = ({ users, onCardClick, onAssignmentChange, pickupPersons, onOpenMap }) => {
  return (
    <div className="overflow-y-auto px-4">
      {users.map((user, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
          onClick={() => onCardClick(user)}
        >
          <div className="mb-4">
            <div className={`bg-${user.STATUS === "PENDING" ? "red" : user.STATUS === "COMPLETED" ? "green" : "gray"}-200 p-2 rounded text-${user.STATUS === "PENDING" ? "red" : user.STATUS === "COMPLETED" ? "green" : "gray"}-800`}>
              {user.STATUS}
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-800">AWB No:</span>
              <span className="text-gray-700">{user.AWB_NUMBER || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Consignee:</span>
              <span className="text-gray-700">{user.CONSIGNEE_NAME || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Pickup Person:</span>
              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={user.PickUpPersonName || ""}
                onChange={(e) => onAssignmentChange(index, e.target.value)}
              >
                {pickupPersons.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Destination:</span>
              <span className="text-gray-700">{user.DESTINATION || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Coordinates:</span>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => onOpenMap(user.LATITUDE, user.LONGITUDE)}
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

export default PickupCards;
