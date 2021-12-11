import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
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
import Players from "./Players";
import Dump from "./Dump";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
          <Button color="inherit" component={RouterLink} to="/stats">
            Stats
          </Button>
          <Button color="inherit" component={RouterLink} to="/spelare">
            Spelare
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
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <div>
          <ButtonAppBar />
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Routes>
            <Route path="/spelare" element={<Players />} />
            <Route path="/errata" element={<Errata />} />
            <Route path="/stats/:countyCode" element={<CountyStats />} />
            <Route path="/stats" element={<CountryStats />} />
            <Route path="/dump" element={<Dump />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function Errata() {
  return <div>Hej</div>;
}
export default App;
