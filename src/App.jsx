import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import SignIn from "./SignIn";
import Home from "./Home";
import DetailScreen from "./DetailScreen"; // Import your DetailScreen component

function App() {
  const [user, setUser] = useState(null); // State to hold the current user
  const navigate = useNavigate(); // Hook to navigate programmatically

  // useEffect(() => {
  //   // Set up the Firebase auth state observer
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       // User is signed in, set user state and navigate to home
  //       setUser(user);
  //       navigate("/home");
  //     } else {
  //       // No user is signed in, set user state to null and navigate to sign-in
  //       setUser(null);
  //       navigate("/");
  //     }
  //   });

  //   // Clean up the subscription on component unmount
  //   return () => unsubscribe();
  // }, [navigate]);

  // if (!user) {
  //   return <SignIn />;
  // }

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/details/:awbNumber" element={<DetailScreen />} />
    </Routes>
  );
}

export default App;
