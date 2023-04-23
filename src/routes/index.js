import Dashboard from "~/pages/Dashboard";
import Accounts from "~/pages/Accounts";
import Orders from "~/pages/Orders";  
import Warehouse from "~/pages/Warehouse";   
import ChatBox from "~/pages/ChatBox"; 
import Login from "~/pages/Login"; 

const publicRoutes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/accounts", component: Accounts},
  { path: "/warehouse", component: Warehouse},
  { path: "/orders", component: Orders},  
  { path: "/chatbox", component: ChatBox}, 
];

export { publicRoutes };
