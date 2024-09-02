import AdminPanel from "./Admin/AdminPanel"
import PickupPanel from "./Pickup/PickupPanel"
function Home() {

  // Step 1: Retrieve the authToken from localStorage
  const authToken = localStorage.getItem("authToken");

  // Step 2: Parse the authToken to extract user details (assuming it's a JSON string)
  let userData = null;

  try {
    userData = authToken ? JSON.parse(authToken) : null;
  } catch (error) {
    console.error("Error parsing authToken from localStorage:", error);
  }

  // Step 3: Check the user's name and role
  const name = userData?.name;
  const role = userData?.role;

  // Step 4: Conditionally render the component based on role
  if (name === "deepak" && role === "admin") {
    return <AdminPanel />;
  } else if (role === "pickup") {
    return <PickupPanel />;
  } else {
    // Optionally render a fallback or nothing if conditions aren't met
    return <div>No Access or Invalid User</div>;
  }
}

export default Home;