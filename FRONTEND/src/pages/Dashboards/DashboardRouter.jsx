import SuperuserDashboard from "./SuperuserDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import UserDashboard from "./UserDashboard.jsx";
import MemberDashboard from "./MemberDashboard.jsx";
import InstructorDashboard from "./InstructorDashboard.jsx";

export default function DashboardRouter() {
  const role = localStorage.getItem("userRole");

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "superuser":
      return <SuperuserDashboard />;
    case "user":
      return <UserDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "member":
    default:
      return <MemberDashboard />;
  }
}
