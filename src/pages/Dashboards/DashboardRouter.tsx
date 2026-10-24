import {DashboardTeam} from './Team/DashboardTeam';
import {DashboardTickets} from './Tickets/DashboardTickets';
import {DashboardProfile} from './Profile/DashboardProfile';
import { Navigate,Route,Routes } from "react-router-dom";
import { RequireAdmin } from "../../Components/dashboards/components/auth/RequireAdmin";
import { Dasboards } from "./Dasboards";
import { DashboardPosts } from "./Posts/DashboardPosts";
import { DashboardProducts } from "./Products/DashboardProducts";
import { DashboardLayout } from "../../Components/dashboards/components/DashboardLayout/DashboardLayout";




import { DashboardPayments } from "./Payments/DashboardPayments";
import { DashboardExpenses } from "./Expenses/DashboardExpenses";
import { DashboardProjects } from "./Projects/DashboardProjects";
import { DashboardTasks } from "./Tasks/DashboardTasks";
import { DashboardSupports } from "./Supports/DashboardSupports";
import { DashboardContacts } from "./Contacts/DashboardContacts";
import { DashboardClients } from "./Clients/DashboardClients";
import { DashboardQuotes } from "./Quotes/DashboardQuotes";
import { DashboardFiles } from "./Files/DashboardFiles";
import { DashboardReports } from "./Reports/DashboardReports";
import { DashboardNotifications } from "./Notifications/DashboardNotifications";
import { DashboardSettings } from "./Settings/DashboardSettings";
import { DashboardLogout } from "./Logout/DashboardLogout";
import { DashboardRequests } from "./Requests/DashboardRequests";
import { DashboardTrash } from "./Trash/DashboardTrash";
import { DashboardHistory } from "./History/DashboardHistory";
import { DashboardAccess } from "./Access/DashboardAccess";

export default function DashboardRouter(){return <Routes><Route path="access" element={<DashboardAccess/>}/><Route path="logout" element={<DashboardLogout/>}/><Route element={<RequireAdmin><DashboardLayout/></RequireAdmin>}>
          <Route index element={<Dasboards />} /><Route path="team" element={<DashboardTeam/>}/><Route path="tickets" element={<DashboardTickets/>}/><Route path="profile" element={<DashboardProfile/>}/>
          <Route path="posts" element={<DashboardPosts />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="payments" element={<DashboardPayments />} />
          <Route path="expenses" element={<DashboardExpenses />} />
          <Route path="projects" element={<DashboardProjects />} />
          <Route path="tasks" element={<DashboardTasks />} />
          <Route path="supports" element={<DashboardSupports />} />
          <Route path="contacts" element={<DashboardContacts />} />
          <Route path="clients" element={<DashboardClients />} />
          <Route path="quotes" element={<DashboardQuotes />} />
          <Route path="files" element={<DashboardFiles />} />
          <Route path="requests" element={<DashboardRequests />} />
          <Route path="trash" element={<DashboardTrash />} />
          <Route path="history" element={<DashboardHistory />} />
          <Route path="proyects" element={<Navigate replace to="/dashboard/projects" />} />
          <Route path="reports" element={<DashboardReports />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="settings" element={<DashboardSettings />} />

</Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes>;}
