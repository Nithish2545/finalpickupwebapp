import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

const API_URL = "https://sheet.best/api/sheets/27658b60-3dca-4cc2-bd34-f65124b8a27d";
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/prfchcqerqk07";
const ASSIGNMENTS_SHEET_URL = "https://sheetdb.io/api/v1/prfchcqerqk07";

function AdminPanel() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState({});
  const [pickupDate, setPickupDate] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState("pickup");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Function to handle sign out
  const signOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Fetch user role from local storage
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

  // Fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get(API_URL);
        setUserData(result.data);
        await fetchAssignments(); // Fetch assignments after user data is loaded
      } catch (error) {
        if (error.response) {
          setError(`Error ${error.response.status}: ${error.response.data.message || error.message}`);
        } else if (error.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole]);

  // Fetch assignments from Google Sheets
  const fetchAssignments = async () => {
    try {
      const result = await axios.get(ASSIGNMENTS_SHEET_URL);
      const assignmentsData = result.data.reduce((acc, item) => {
        acc[item.AWB_NUMBER] = item.PickUpPersonName; // Adjust based on your sheet structure
        return acc;
      }, {});
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments from Google Sheets:", error);
    }
  };

  // Update pickup person with retry logic
  const updatePickUpPersonWithRetry = async (awbNumber, pickUpPerson, retryCount = 0) => {
    try {
      const url = `${SHEETDB_API_URL}/id/${awbNumber}`;
      const response = await axios.patch(
        url,
        { data: { PickUpPersonName: pickUpPerson } },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update the row");
      }

      console.log("PickUpPersonName updated successfully");
      await fetchAssignments(); // Refresh assignments after update
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < 3) {
        console.warn("Rate limit exceeded, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        await updatePickUpPersonWithRetry(awbNumber, pickUpPerson, retryCount + 1);
      } else {
        console.error("Error updating PickUpPersonName:", error);
      }
    }
  };

  // Handle assignment change
  const handleAssignmentChange = async (index, value) => {
    const selectedUser = userData[index];
    const awbNumber = selectedUser.AWB_NUMBER;
    await updatePickUpPersonWithRetry(awbNumber, value);
  };

  // Navigate to user detail page
  const handleCardPress = (user) => {
    navigate("/detail", { state: { user } });
  };

  // Open Google Maps with given latitude and longitude
  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const pickupPersons = ["Unassigned", "anish", "sathish"];

  // Filter user data based on user role
  const filteredUserData = userData.filter((user) => {
    if (userRole === "admin" || userRole === "deepak") {
      return true;
    } else if (userRole === "anish" || userRole === "sathish") {
      return user.PickUpPersonName === userRole;
    }
    return false;
  });

  // Filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case "pickup":
        return filteredUserData.filter(user => user.STATUS === "PICKUP");
      case "connections":
        return filteredUserData.filter(user => user.STATUS === "OUTGOING MANIFEST");
      case "paymentDone":
        return filteredUserData.filter(user => user.STATUS === "PAYMENT DONE");
      default:
        return [];
    }
  };

  // Calculate the items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getFilteredData().slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <label className="font-bold text-gray-700">Pickup Date:</label>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-32"
            placeholder="Select Date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
      <div className="p-4">
        <div className="flex space-x-4 border-b border-gray-300">
          <button
            className={`py-2 px-4 rounded ${activeTab === "pickup" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("pickup")}
          >
            Pickup
          </button>
          <button
            className={`py-2 px-4 rounded ${activeTab === "connections" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("connections")}
          >
            Connections
          </button>
          <button
            className={`py-2 px-4 rounded ${activeTab === "paymentDone" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("paymentDone")}
          >
            Payment Done
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold">{userRole} : {userName}</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-purple-600" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">{error}</p>
      ) : (
        <div className="overflow-y-auto px-4">
          {currentItems.map((user, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
              onClick={() => handleCardPress(user)}
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
                    onChange={(e) => handleAssignmentChange(index, e.target.value)}
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
                    onClick={() => handleOpenMap(user.LATITUDE, user.LONGITUDE)}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination controls */}
          {/* <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(getFilteredData().length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                className={`py-1 px-3 mx-1 rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;