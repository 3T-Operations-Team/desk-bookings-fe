import { createLazyFileRoute } from "@tanstack/react-router";
import LoginPage from "../pages/LoginPage";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../auth";

const LoginLayout = () => {
  const auth = useAuth();

  if (auth.userToken) return <Navigate to="/" />;

  return <LoginPage />;
};

export const Route = createLazyFileRoute("/login")({
  component: LoginLayout,
});
