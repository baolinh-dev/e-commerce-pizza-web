import Dashboard from "~/pages/Dashboard";
import Accounts from "~/pages/Accounts";
import Orders from "~/pages/Orders";  
import Warehouse from "~/pages/Warehouse";  
import Login from "~/pages/Login"; 

const publicRoutes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/accounts", component: Accounts},
  { path: "/warehouse", component: Warehouse},
  { path: "/orders", component: Orders}, 
];

export { publicRoutes };
