import { faClipboardList, faGauge, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

const Links = [ 
    { 
        path: "/", 
        name: "DashBoard", 
        icon: faGauge
    }, 
    { 
        path: "/accounts", 
        name: "Accounts", 
        icon: faCircleUser
    }, 
    { 
        path: "/warehouse", 
        name: "Warehouse", 
        icon: faWarehouse
    }, 
    { 
        path: "/orders", 
        name: "Orders", 
        icon: faClipboardList
    },
] 

export default Links;