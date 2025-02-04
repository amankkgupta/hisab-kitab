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
  const { user, fetchData, allTotal, setTransData, setCustomerData } =
    useContext(UserContext);

  const showAddCustomer = () => {
    setAddCustomerPop(!addCustomerPop);
  };

  const handleTrans = (transType, customerName, customerId) => {
    setAddTransPop(true);
    setTransData({
      transType,
      customerName,
      customerId,
    });
  };

  const handleCustomerView = (name, id, ind) => {
    setCustomerData({
      customerName: name,
      customerId: id,
      customerInd: ind,
    });
    navigate("/customerview");
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
            return (
              <div
                key={ind}
                className="flex items-center my-2 p-1 bg-indigo-400 rounded-md"
              >
                <div className="flex gap-2 items-center w-full">
                  <div className="bg-amber-300 rounded-md h-12 w-12 flex justify-center items-center">
                    {customer.name[0]}
                  </div>

                  <div
                    className=" flex-grow"
                    onClick={() => {
                      handleCustomerView(customer.name, customer._id, ind);
                    }}
                  >
                    <h1>{customer.name}</h1>
                    {customer.lastTransact && (
                      <>
                        <h1
                          className={`${
                            customer.lastTransact.isDeleted
                              ? "line-through"
                              : ""
                          } text-xs text-gray-800`}
                        >{`$${Math.abs(customer.lastTransact.amount)} ${
                          customer.lastTransact.amount < 0 ? "Taken" : "Given"
                        } on ${dayjs(customer.lastTransact.date).format(
                          "D MMM YYYY hh:mma"
                        )}`}</h1>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-1">
                  <h1
                    className={`${
                      customer.totalAmount < 0
                        ? "text-emerald-700"
                        : "text-red-700"
                    } font-bold`}
                  >
                    ${Math.abs(customer.totalAmount)}
                  </h1>
                  <button
                    onClick={() => handleTrans(1, customer.name, customer._id)}
                    className="bg-green-500 p-1 rounded-md"
                  >
                    Take
                  </button>
                  <button
                    onClick={() => handleTrans(0, customer.name, customer._id)}
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
