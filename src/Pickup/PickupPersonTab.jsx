import { useNavigate } from 'react-router-dom';

const PickupPersonTab = ({
  userData,
  handleAssignmentChange,
  handleCardPress,
  handleOpenMap,
  pickupPersons,
}) => {
  
  const navigate = useNavigate();

  const handleCardClick = (awbNumber) => {
    navigate(`/PickupDetails/${awbNumber}`);
  };

  return (
    <div>
      {userData.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No pickups available
        </div>
      ) : (
        userData.map((user, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
            onClick={() => handleCardClick(user.AWB_NUMBER)}
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
        ))
      )}
    </div>
  );
};

export default PickupPersonTab;