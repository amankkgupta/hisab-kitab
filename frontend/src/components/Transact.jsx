import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { toast } from "sonner";

const Transact = ({ setAddTransPop, fetchAllTransacts }) => {
  const { transData, fetchData } = useContext(UserContext);
  const [data, setData] = useState({
    amount: "",
    note: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const text = `${transData.transType ? "Take from " : "Give to "}${
    transData.customerName
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let amount = data.amount;
    if(amount<=0) return toast.warning("Please enter positive value");
    console.log(transData.isSupplier, transData.transType);
    if (!transData.isSupplier) {
      if (transData.transType) {
        amount = -Math.abs(Number(amount));
      }
    } else {
      if (!transData.transType) {
        amount = -Math.abs(Number(amount));
      }
    }

    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/api/transact/addtransact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: data.note,
          amount,
          customerId: transData.customerId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "unpected error");
      toast.success(resData.message);
      setAddTransPop(false);
      if (fetchAllTransacts) {
        fetchAllTransacts();
      } else {
        fetchData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={data.amount}
          onChange={(e) => handleChange(e)}
          required
          name="amount"
          type="number"
          className="p-1 border rounded-md w-full mt-2"
          placeholder="Enter amount"
        />
        <input
          value={data.note}
          onChange={(e) => handleChange(e)}
          name="note"
          type="text"
          className="p-1 border rounded-md w-full mt-2"
          placeholder="Enter Note (optional)"
        />
        <div className="flex gap-2">
          <button
            className={`w-full p-2 ${
              transData.transType ? "bg-emerald-500" : "bg-red-500"
            } rounded-md mt-2`}
          >
            {text}
          </button>

          <button
            onClick={() => setAddTransPop(false)}
            className=" p-2 bg-yellow-500 rounded-md mt-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Transact;
