import React, { useState, createContext, useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import { publicStationsContext } from "./PublicStationsProvider";

export const myOrdersContext = createContext([]);

export const MyOrdersProvider = ({ children }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const { orders } = useContext(publicStationsContext);
  const [myOrders, setMyOrders] = useState(
    orders.filter(({ sub_id }) => sub_id == user.uid)
  );
  const filterOrders = () => {
    setMyOrders(orders.filter(({ sub_id }) => sub_id == user.uid));
  };
  useEffect(filterOrders, [orders]);
  return (
    <myOrdersContext.Provider value={{ myOrders, setMyOrders }}>
      {children}
    </myOrdersContext.Provider>
  );
};
