import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Avatar, ListItemText, Menu } from "@mui/material";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { USERS } from "../firebase";
import { database } from "../firebase";
import { GlobalTheme } from "../pages/styling/Theme";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { ThemeProvider } from "@mui/material";
import "./style/DrawerNavBar.css";

const drawerWidth = 240;
const navItems = ["Requests", "Walker", "Schedule", "Profile", "Support"];

function DrawerAppBar(props) {
  const [displayPicLink, setDisplayPicLink] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (props.user) {
      const profilePathway = `${USERS}/${props.user.uid}/PROFILE`;
      const profileRef = ref(database, profilePathway);

      get(profileRef).then((snapshot) => {
        if (snapshot.val()) {
          setDisplayPicLink(snapshot.val().displayPic);
          setUserName(snapshot.val().name);
        }
      });
    }
  }, [props.user]);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <ThemeProvider theme={GlobalTheme}>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Link to="/Profile" style={{ textDecoration: "none" }}>
          <div className="Navbar-Mobile-Drawer-Top-Div">
            <div className="Navbar-Mobile-Drawer-Top-Div-Avatar">
              <Avatar
                alt="Username profile"
                src={`${displayPicLink}`}
                sx={{ margin: "5px 5px 0px 0px " }}
              />
              <Typography color="primary">{userName}</Typography>
            </div>
          </div>
        </Link>
        {/* <Typography color="primary" variant="h6" sx={{ my: 2 }}>
          NAW
        </Typography> */}
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <Link to={`/${item}`} style={{ textDecoration: "none" }}>
                <ListItemButton sx={{ textAlign: "center", color: "primary" }}>
                  {item}
                  {/* <ListItemText primary={item} /> */}
                </ListItemButton>
                <Divider />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </ThemeProvider>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={GlobalTheme}>
      <Box sx={{ display: "flex", margin: "50px 30px" }}>
        <AppBar
          color="secondary"
          component="nav"
          sx={{ margin: "0px 0px 20px 0px" }}
        >
          <Toolbar>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="primary"
              component="div"
              sx={{
                margin: "20px",
                flexGrow: 0,
                display: { sm: "block" },
              }}
            >
              Need A Walk
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" }, flexGrow: 0.9 }}>
              <Link to="/Requests" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "primary" }}>Request</Button>{" "}
              </Link>
              <Link to="/Walker" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "primary" }}>Find a Walker</Button>{" "}
              </Link>
              <Link to="/Schedule" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "primary" }}>Schedule</Button>{" "}
              </Link>
              <Link to="/Profile" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "primary" }}>Profile</Button>
              </Link>
              <Link to="/Support" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "primary" }}>Support</Button>
              </Link>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {displayPicLink && (
                <Avatar alt="Username profile" src={`${displayPicLink}`} />
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DrawerAppBar;

// DrawerAppBar.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func,
// };

/* <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          unde fugit veniam eius, perspiciatis sunt? Corporis qui ducimus
          ventore sapiente
        </Typography>
      </Box> */

/* {navItems.map((item) => (
              <Link
                to={`/${item}`}
                style={{ textDecoration: "none" }}
                key={item}
              >
                <Button sx={{ color: "#fff" }}>{item}</Button>
              </Link>
            ))} */
