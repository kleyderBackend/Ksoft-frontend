import { Login } from "../../../Components/dashboards/components/auth/login";
import styles from "./DashboardAccess.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { cloudEnabled, requireSupabase } from "../../../lib/supabase";
export const DashboardAccess = () => {
  const location = useLocation(),
    navigate = useNavigate();
  const signIn = async (credentials: { email: string; password: string }) => {
    const { error } =
      await requireSupabase().auth.signInWithPassword(credentials);
    if (error) throw error;
    const destination = location.state?.from;
    navigate(
      typeof destination === "string" &&
        /^\/dashboard(?:\/|\?|$)/.test(destination) &&
        !destination.startsWith("/dashboard/access")
        ? destination
        : "/dashboard",
      { replace: true },
    );
  };
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <Login onLogin={cloudEnabled ? signIn : undefined} />
    </main>
  );
};
