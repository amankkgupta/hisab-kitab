import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {

  const navigate= useNavigate();

  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Unexpected error occurred");
      }
      toast.success(resData.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex p-5 justify-center items-center h-screen w-full">
      <div className="bg-white p-8 rounded-md md:w-1/2 w-full">
        <h1 className="text-3xl text-center font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              value={data.name}
              onChange={(e) => handleChange(e)}
              required
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="block font-medium">
              Phone
            </label>
            <input
              value={data.phone}
              onChange={(e) => handleChange(e)}
              required
              type="number"
              id="phone"
              name="phone"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              value={data.email}
              onChange={(e) => handleChange(e)}
              required
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              value={data.password}
              onChange={(e) => handleChange(e)}
              required
              type="text"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-3">
            <h1>
              Already registered?{" "}
              <span onClick={()=> navigate("/")} className="text-indigo-600">Login Here</span>
            </h1>
          </div>
          <button className="bg-indigo-500 p-2 w-full rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
