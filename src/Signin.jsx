import React from "react";
import { useForm, Controller } from "react-hook-form";
import { auth } from "./firebase"; // Ensure you have configured Firebase correctly
import { signInWithEmailAndPassword } from "firebase/auth";
import { json, useNavigate } from "react-router-dom";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("You are signed in successfully!");
      // Redirect or handle post-sign-in logic here
      if (auth.currentUser.email == "deepak@gmail.com") {
        localStorage.setItem(
          "authToken",
          JSON.stringify({ email: "deepak@gmail.com", role: "admin" , name:"deepak" })
        );
        navigate("/home");
        return;
      }
      if (auth.currentUser.email == "anish@gmail.com") {
        localStorage.setItem(
          "authToken",
          JSON.stringify({ email: "anish@gmail.com", role: "pickup" , name:"anish" })
        );
        navigate("/home");
        return;
      }

      if (auth.currentUser.email == "sathish@gmail.com") {
        localStorage.setItem(
          "authToken",
          JSON.stringify({ email: "sathish@gmail.com", role: "pickup" , name :"sathish"})
        );
        navigate("/home");
        return;
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h1>
      <div className="w-full max-w-md">
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type="email"
              className={`w-full p-3 mb-4 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type="password"
              className={`w-full p-3 mb-4 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
        )}

        <button
          className="w-full bg-purple-700 text-white p-3 rounded font-bold hover:bg-purple-800"
          onClick={handleSubmit(onSubmit)}
        >
          Sign In
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-purple-700 underline cursor-pointer">
              Sign Up
            </span>
          </p>
          <button
            className="text-purple-700 underline mt-2"
            onClick={() => alert("Forgot Password clicked")}
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;