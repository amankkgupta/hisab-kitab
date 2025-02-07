import React, { useState } from "react";
import { toast } from "sonner";

const AddCustomer = ({ showAddCustomer, fetchData }) => {
  const [data, setData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/api/customer/addcustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Server Error !");
      toast.success(resData.message);
      showAddCustomer();
      fetchData();
    } catch (err) {
      toast.error(err.message || "Unexpected error occured !");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="p-2 border rounded-md w-full mb-2"
            required
            value={data.name}
            onChange={(e) => handleChange(e)}
            type="text"
            name="name"
            id="name"
            placeholder="Customer Name"
          />
          <input
            value={data.phone}
            onChange={(e) => handleChange(e)}
            className="p-2 border rounded-md w-full mb-2"
            type="number"
            name="phone"
            id="phone"
            placeholder="Customer Phone Number (Optional)"
          />
        </div>

        <button className="w-full mb-2 bg-emerald-600 rounded-md p-2">
          Save
        </button>
      </form>
    </>
  );
};

export default AddCustomer;
