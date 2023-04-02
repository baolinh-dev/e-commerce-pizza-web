import Dashboard from "~/pages/Dashboard";
import Accounts from "~/pages/Accounts";
import Orders from "~/pages/Orders";  
import Warehouse from "~/pages/Warehouse"; 

const publicRoutes = [
  { path: "/", component: Dashboard },
  { path: "/accounts", component: Accounts},
  { path: "/warehouse", component: Warehouse},
  { path: "/orders", component: Orders},
];

export { publicRoutes };
