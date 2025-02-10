import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {

    const navigate= useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    const basrUrl= import.meta.env.VITE_BACKEND_URL;
    try{
        const res= await fetch(`${basrUrl}/api/auth/signin`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const resData= await res.json();
        if(!res.ok)
            throw new Error(resData.message || "Something went wrong");
        toast.success(resData.message);
        localStorage.setItem("token", resData.token);
        navigate("/");
    } catch(err) {
        toast.error(err.message);
    }
  }

  return (
    <div className="flex justify-center items-center p-5 w-full h-full">
      <div className=" bg-white p-5 rounded-md md:w-1/2 w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium" htmlFor="email">
            Email / Phone
          </label>
          <input
            value={data.email}
            onChange={e=>handleChange(e)}
            required
            type="text"
            name="email"
            id="email"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium" htmlFor="email">
            Password
          </label>
          <input
            value={data.password}
            onChange={e=>handleChange(e)}
            required
            type="text"
            name="password"
            id="password"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <h1>
            Don't have account?{" "}
            <span onClick={()=> navigate("/register")} className="text-indigo-600">Register Here</span>
          </h1>
        </div>
        <button className="bg-indigo-500 p-2 rounded-md w-full">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
