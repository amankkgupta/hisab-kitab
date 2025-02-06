import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import Transact from "../components/Transact";
import EditTransact from "../components/EditTransact";

const CustomerView = () => {
  const navigate = useNavigate();
  const { customerData, user, setTransData } = useContext(UserContext);
  const { customerName, customerId, customerInd } = customerData;
  const [addTransPop, setAddTransPop] = useState(false);
  const [editTransPop, setEditTransPop] = useState(false);
  const [transacts, setTransacts] = useState([]);
  const [trans, setTrans] = useState(null);

  const handleTrans = (transType) => {
    setAddTransPop(true);
    setTransData({
      transType,
      customerName,
      customerId,
    });
  };

  const handleEditTrans = (trans) => {
    setEditTransPop(true);
    setTrans(trans);
  };

  useEffect(() => {
    const fetchAllTransact = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const res = await fetch(`${baseUrl}/transact/fetchalltransact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customerId }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || "Unexpected error !");
        setTransacts(resData.trans);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchAllTransact();
  }, [user]);

  return (
    <div className="md:max-w-1/2 h-screen w-full p-2 flex flex-col">
      <div className="flex p-1 items-center gap-2 w-full bg-amber-500 rounded-md">
        <div className="h-12 w-12 bg-yellow-400 rounded-md flex justify-center items-center">
          {customerName[0]}
        </div>
        <h1>{customerName}</h1>
      </div>

      <div className="history w-full flex-grow overflow-auto">
        {transacts &&
          transacts.map((trans, ind) => {
            const currDate = dayjs(trans.date).format("D MMM YYYY");
            const prevDate =
              ind <= 0
                ? null
                : dayjs(transacts[ind - 1].date).format("D MMM YYYY");
            const time = dayjs(trans.date).format("h:mm A");

            return (
              <React.Fragment key={ind}>
                {currDate != prevDate && (
                  <div className="flex justify-center items-center sticky top-1 m-1">
                    <h1 className="text-center bg-white py-1 px-4 rounded-2xl">
                      {currDate}
                    </h1>
                  </div>
                )}

                <div
                  className={`${
                    user.userId == trans.userId ? "justify-end" : ""
                  } flex`}
                >
                  <div
                    onClick={() => {
                      handleEditTrans(trans);
                    }}
                    className={`${
                      trans.amount > 0 ? "bg-red-400" : "bg-green-300"
                    }  m-1 w-3/4 p-1 rounded-md`}
                  >
                    <h1
                      className={`${
                        trans.isDeleted ? "line-through" : ""
                      } text-center font-bold text-xl`}
                    >
                      ${Math.abs(trans.amount)}
                    </h1>
                    <h1 className="text-center text-sm">{trans.note}</h1>
                    <div className="flex justify-between">
                      <h1 className="text-xs">
                        Total: {Math.abs(trans.totalAmount)}{" "}
                        {trans.totalAmount < 0 ? "Adv" : "Due"}
                      </h1>
                      <h1 className="text-xs">{time}</h1>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>

      {!editTransPop && (
        <div>
          {transacts && (
            <div className="flex justify-between m-2">
              <h1 className="font-bold text-2xl">Total</h1>
              <h1
                className={`${
                  user.customers[customerInd].totalAmount < 0 ? "text-green-700" : "text-red-700"
                } font-bold text-2xl`}
              >
                ${Math.abs(user.customers[customerInd].totalAmount)} {user.customers[customerInd].totalAmount < 0 ? "Adv" : "Due"}
              </h1>
            </div>
          )}
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleTrans(1)}
              className="bg-green-500 p-2 w-full rounded-md"
            >
              Take
            </button>
            <button
              onClick={() => handleTrans(0)}
              className="bg-red-500 p-2 w-full rounded-md"
            >
              Give
            </button>
          </div>
          {addTransPop && <Transact {...{ setAddTransPop }} />}
        </div>
      )}
      {editTransPop && <EditTransact {...{ setEditTransPop, trans }} />}
    </div>
  );
};

export default CustomerView;
