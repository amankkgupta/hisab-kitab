import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState(null);
  const [allTotal, setAllTotal] = useState(0);
  const [transData, setTransData] = useState({});
  const [customerData, setCustomerData] = useState({});

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/api/customer/fetchuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Something went wrong!");
      const total = resData.records.reduce((sum, record) => {
        if (record.userId != resData.user.userId) sum -= record.totalAmount;
        else sum += record.totalAmount;
        return sum;
      }, 0);
      // console.log(resData);
      setAllTotal(total);
      setUser(resData.user);
      setRecords(resData.records);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        records,
        transData,
        customerData,
        allTotal,
        setTransData,
        setCustomerData,
        fetchData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
