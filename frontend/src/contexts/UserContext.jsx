import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const UserContext = createContext(null);


const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [allTotal, setAllTotal] = useState(0);
  const [transData, setTransData] = useState({});
  const [customerData, setCustomerData] = useState({});

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${baseUrl}/customer/fetchuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Something went wrong!");
      console.log(resData);
      const t=resData.lastTransact.reduce((sum, transact)=>{
        return sum+transact.totalAmount;
      },0)
      setAllTotal(t);
      setUser(resData);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <UserContext.Provider value={{ user, transData, customerData, allTotal, setTransData, setCustomerData, fetchData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
