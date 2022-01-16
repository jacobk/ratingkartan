import { useEffect } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
  Navigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CountryStats from "./CountryStats";
import CountyStats from "./CountyStats";
import Players from "./Players";
import Info from "./Info";
import Dump from "./Dump";
import { createTheme, ThemeProvider } from "@mui/material";
import logo from "./images/logo3.svg";
import { metadata } from "./data";
import ReactGA from "react-ga4";

ReactGA.initialize("G-YQVD552TQC");
ReactGA.send("pageview");

const theme = createTheme({});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page_location: pathname });
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
          <img src={logo} alt="ratingkartan" style={{ height: 50 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            rk
          </Typography>

          <Button color="inherit" component={RouterLink} to="/stats">
            Stats
          </Button>
          <Button color="inherit" component={RouterLink} to="/spelare">
            Spelare
          </Button>
          <Button color="inherit" component={RouterLink} to="/info">
            Info
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
      <Router basename="/">
        <ScrollToTop />
        <div>
          <ButtonAppBar />
          <Box
            sx={{
              fontSize: "0.8rem",
              fontFamily: "monospace",
              textAlign: "center",
              p: 1,
              color: "text.disabled",
              bgcolor: (theme) => theme.palette.grey.A100,
              mb: {
                xs: 1,
                sm: 0,
              },
            }}
          >
            Uppdaterad: {metadata.generatedTime}
          </Box>
          <Routes>
            <Route path="/spelare" element={<Players />} />
            <Route path="/info" element={<Info />} />
            <Route path="/stats/:countyCode" element={<CountyStats />} />
            <Route path="/stats" element={<CountryStats />} />
            <Route path="/dump" element={<Dump />} />
            <Route path="/" element={<Navigate replace to="/stats" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
