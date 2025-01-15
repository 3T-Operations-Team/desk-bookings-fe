import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../auth";
import { useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const router = useRouterState();

  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>();

  const { userEmail, logout } = useAuth();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined);
  };

  const mainButtonProps = {
    text: router.location.pathname === "/" ? "My Bookings" : "Book a Desk",
    route: router.location.pathname === "/" ? "/myBookings" : "/",
  };

  return (
    <Box>
      <AppBar position="sticky" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <img
            src="work-station.png"
            height={"30px"}
            alt="Icon made by Freepik from www.flaticon.com"
          />
          <Button
            onClick={() => navigate({ to: mainButtonProps.route })}
            sx={{ marginLeft: "20px", color: "black" }}
          >
            {mainButtonProps.text}
          </Button>
          <span style={{ flexGrow: 1 }} />
          <Box>
            <Button
              sx={{ textTransform: "none", color: "black" }}
              onClick={handleOpenUserMenu}
            >
              <Typography>{userEmail}</Typography>
            </Button>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={logout}>
                <Typography sx={{ color: "lightsalmon" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
