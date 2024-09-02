const PickupTab = ({
  userData,
  handleAssignmentChange,
  handleCardPress,
  handleOpenMap,
  pickupPersons,
}) => {
  return (
    <div>
      {userData.map((user, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
        >
          <div className="mb-4">
            <div
              className={`bg-${
                user.STATUS === "PENDING"
                  ? "red"
                  : user.STATUS === "COMPLETED"
                  ? "green"
                  : "gray"
              }-200 p-2 rounded text-${
                user.STATUS === "PENDING"
                  ? "red"
                  : user.STATUS === "COMPLETED"
                  ? "green"
                  : "gray"
              }-800`}
            >
              {user.STATUS}
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-800">AWB No:</span>
              <span className="text-gray-700">{user.AWB_NUMBER || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Consignee:</span>
              <span className="text-gray-700">{user.NAME || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">
                Pickup Person:
              </span>
              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={user.PickUpPersonName || ""}
                onChange={(e) => handleAssignmentChange(index, e.target.value)}
              >
                {pickupPersons.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Destination:</span>
              <span className="text-gray-700">{user.DESTINATION || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Weight APX:</span>
              <span className="text-gray-700">{user.WEIGHTAPX || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Phone number:</span>
              <span className="text-gray-700">{user.PHONENUMBER || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Pickup DateTime:</span>
              <span className="text-gray-700">{user.PICKUP_DATETIME || ""}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Coordinates:</span>
              <button
                className="bg-purple-500 text-white px-2 py-1 rounded"
                onClick={() => handleOpenMap(user.LATITUDE, user.LONGITUDE)}
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

export default PickupTab;