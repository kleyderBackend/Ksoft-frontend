import { DashboardOverview } from "../../Components/dashboards/components/Overview/DashboardOverview";
import {DeveloperOverview} from "../../Components/dashboards/components/DeveloperWork/DeveloperOverview";
import {useAdmin} from "../../Components/dashboards/AdminContext";

export const Dasboards = () => {
  const {role}=useAdmin();return role!=="admin"?<DeveloperOverview/>:<DashboardOverview />;
};
