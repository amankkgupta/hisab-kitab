import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../contexts/UserContext";
import dayjs from "dayjs";

const EditTransact = ({ setEditTransPop, trans }) => {
  const [note, setNote] = useState(trans.note);
  const { fetchData } = useContext(UserContext);

  let dueadv, givetake;
  if (trans.isSupplier) {
    dueadv = trans.totalAmount > 0 ? "Adv" : "Due";
    givetake = trans.amount > 0 ? "Taken" : "Given";
  } else {
    dueadv = trans.totalAmount < 0 ? "Adv" : "Due";
    givetake = trans.amount < 0 ? "Taken" : "Given";
  }

  useEffect(() => {
    setNote(trans.note);
  }, [trans]);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleEdit = async (isDeleted) => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/api/transact/edittransact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isDeleted,
          note,
          transactId: trans._id,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Unexpected Error !");
      toast.success(resData.message);
      setEditTransPop(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md bg-indigo-400 p-5">
      <h1 className="text-sm px-2 bg-yellow-100 rounded-md">{trans.addedBy}</h1>
      <h1
        className={`${
          givetake == "Taken" ? "text-emerald-600" : "text-red-500"
        } text-2xl font-bold text-center`}
      >
        ${Math.abs(trans.amount)} {givetake}
      </h1>
      <div className="flex justify-between">
        <h1 className="text-sm">
          Total: {Math.abs(trans.totalAmount)} {dueadv}
        </h1>
        <h1 className="text-sm">
          {dayjs(trans.date).format("D MMM YYYY hh:mma")}
        </h1>
      </div>
      <input
        value={note}
        onChange={(e) => handleChange(e)}
        type="text"
        className="border p-2 rounded-md w-full"
      />
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => handleEdit(false)}
          className="p-2 bg-emerald-500 w-full rounded-md"
        >
          Save
        </button>
        <button
          onClick={() => handleEdit(true)}
          className="p-2 bg-red-500 w-full rounded-md"
        >
          Delete
        </button>
        <button
          onClick={() => setEditTransPop(false)}
          className="p-2 bg-yellow-500 w-full rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTransact;
