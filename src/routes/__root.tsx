import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "../auth";
import { Navigate } from "@tanstack/react-router";
import NavBar from "../components/NavBar";

const DefaultLayout = () => {
  const auth = useAuth();

  if (!auth.userEmail)
    return (
      <>
        <Navigate to="/login" />
        <Outlet />
      </>
    );

  return (
    <>
      <NavBar />
      <span className="contents">
        <Outlet />
      </span>
    </>
  );
};

export const Route = createRootRoute({
  component: DefaultLayout,
});
