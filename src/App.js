import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CountryStats from "./CountryStats";
import CountyStats from "./CountyStats";

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "white", color: "text.primary" }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button color="inherit" component={RouterLink} to="/toplistan">
            Topplistan
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Stats
          </Button>
          <Button color="inherit" component={RouterLink} to="/errata">
            Errata
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

function App() {
  return (
    <Router>
      <div>
        <ButtonAppBar />
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/toplistan">
            <Toplistan />
          </Route>
          <Route path="/errata">
            <Errata />
          </Route>
          <Route path="/stats/:countyCode">
            <CountyStats />
          </Route>
          <Route path="/stats">
            <CountryStats />
          </Route>
          {/* <Route path="/stats/:countyCode">
            <StatsForCounty />
          </Route> */}
        </Switch>
      </div>
    </Router>
  );
}

function Toplistan() {
  return <div>Hej</div>;
}

function Errata() {
  return <div>Hej</div>;
}
export default App;
