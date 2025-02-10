import React, { useContext, useEffect, useState } from "react";
import AddCustomer from "../components/AddCustomer";
import { UserContext } from "../contexts/UserContext";
import Transact from "../components/Transact";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [addCustomerPop, setAddCustomerPop] = useState(false);
  const [addTransPop, setAddTransPop] = useState(false);
  const { user, records, fetchData, allTotal, setTransData } =
    useContext(UserContext);

  const showAddCustomer = () => {
    setAddCustomerPop(!addCustomerPop);
  };

  const handleTrans = (transType, customerName, customerId, isSupplier) => {
    setAddTransPop(true);
    setTransData({
      transType,
      customerName,
      customerId,
      isSupplier,
    });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCustomerView = (name, id) => {
    navigate(`/customerview?customerName=${name}&customerId=${id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    fetchData();
  }, []);

  return (
    <div className="md:max-w-1/2 h-full w-full p-2 flex flex-col">
      <div>
        <div className="flex gap-2 items-center justify-between bg-purple-400 p-1 rounded-md">
          <div className="flex gap-2 items-center">
            <div className="h-11 w-11 bg-amber-300 rounded-full flex justify-center items-center">
              {user?.name[0]}
            </div>
            <h1>{user?.name}</h1>
          </div>
          <div>
            <h1 onClick={logout} className="">
              Logout
            </h1>
          </div>
        </div>

        <div className="flex justify-between item-center my-1">
          <h1 className="text-xl font-bold">Total</h1>
          {user != null && (
            <h1
              className={`${
                allTotal < 0 ? "text-green-700" : "text-red-700"
              } text-xl font-bold`}
            >
              ${Math.abs(allTotal)} {allTotal < 0 ? "Adv" : "Due"}
            </h1>
          )}
        </div>

        <div className="my-1 flex justify-between items-center">
          {user != null && <h1>Customers ({user.customers.length})</h1>}
          <button
            onClick={showAddCustomer}
            className={`${
              addCustomerPop ? "bg-red-500" : "bg-emerald-500"
            } py-1 px-4 rounded-md`}
          >
            {addCustomerPop ? "Cancel" : "Add"}
          </button>
        </div>

        {addCustomerPop && (
          <AddCustomer
            showAddCustomer={showAddCustomer}
            fetchData={fetchData}
          />
        )}
      </div>
      <div className="h-full overflow-auto">
        {user != null && !user.customers.length && (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-4xl font-bold text-gray-500">No Customers</h1>
          </div>
        )}
        {user != null &&
          user.customers &&
          user.customers.map((customer, ind) => {
            const supplier = records[ind]?.userId != user.userId;
            let status, totalcolor;
            if (supplier) {
              status =
                records[ind]?.lastTransact?.amount < 0 ? "Given" : "Taken";
              totalcolor =
                records[ind]?.totalAmount < 0
                  ? "text-red-700"
                  : "text-emerald-700";
            } else {
              status =
                records[ind].lastTransact?.amount < 0 ? "Taken" : "Given";
              totalcolor =
                records[ind]?.totalAmount < 0
                  ? "text-emerald-700"
                  : "text-red-700";
            }

            return (
              <div
                key={ind}
                className={`flex items-center my-2 p-1 ${
                  supplier ? "bg-blue-400" : "bg-indigo-400"
                } rounded-md`}
              >
                <div className="flex gap-2 items-center w-full">
                  <div className="bg-amber-300 rounded-md h-12 w-12 flex justify-center items-center">
                    {customer.name[0]}
                  </div>

                  <div
                    className=" flex-grow"
                    onClick={() => {
                      handleCustomerView(customer.name, customer._id);
                    }}
                  >
                    <h1>
                      {customer.name} {supplier ? "(Supplier)" : ""}
                    </h1>
                    {records[ind]?.lastTransact && (
                      <>
                        <h1
                          className={`${
                            records[ind].lastTransact.isDeleted
                              ? "line-through"
                              : ""
                          } text-xs text-gray-800`}
                        >{`$${Math.abs(
                          records[ind]?.lastTransact.amount
                        )} ${status} on ${dayjs(
                          records[0]?.lastTransact?.date
                        ).format("D MMM YYYY hh:mma")}`}</h1>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-1">
                  <h1 className={`${totalcolor} font-bold`}>
                    ${Math.abs(records[ind]?.totalAmount)}
                  </h1>
                  <button
                    onClick={() =>
                      handleTrans(1, customer.name, customer._id, supplier)
                    }
                    className="bg-green-500 p-1 rounded-md"
                  >
                    Take
                  </button>

                  <button
                    onClick={() =>
                      handleTrans(0, customer.name, customer._id, supplier)
                    }
                    className="bg-red-500 p-1 rounded-md"
                  >
                    Give
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      {addTransPop && <Transact {...{ setAddTransPop }} />}
    </div>
  );
};

export default Dashboard;
