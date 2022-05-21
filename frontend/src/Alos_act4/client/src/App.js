import { useEffect, useState } from ( "react");
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
const Dashboard = require( "./components/Dashboard");
const Login = require( "./components/Login");
const Signup = require( "./components/Signup");

const Cookies = require( "js-cookie");
const { refreshExpiredToken, setAuthToken } = require( "./api/tokenfile");
const { Spin } = require( "antd");
const { LoadingOutlined } = require( "@ant-design/icons");

const Loader = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
};

function App() {
  const [token, setToken] = useState(Cookies.get("accessToken") ?? ""); 

  const [interval, setIntervalHandler] = useState(0);

  const [fetchingToken, setFetchingToken] = useState(token === ""); 

  useEffect(() => {
    window.clearInterval(interval); 
    let cookieToken = Cookies.get("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");

    if (
      cookieToken == undefined &&
      refreshToken != undefined &&
      refreshToken.length > 0
    ) {
      setFetchingToken(true);
      refreshExpiredToken(refreshToken).then((res) => {
        var in15minutes = new Date(new Date().getTime() + 900000);

        Cookies.set("accessToken", res.data.accessToken, {
          expires: in15minutes,
        });
        localStorage.setItem("refreshToken", res.data.refreshToken);

        setAuthToken(res.data.accessToken);
        setToken(res.data.accessToken);

        setFetchingToken(false);

        let handler = window.setInterval(checkCookie, 100); 
        setIntervalHandler(handler);
      });
    } else {
      setFetchingToken(false);
      console.log({
        cookieToken,
        refreshToken,
      });
      let handler = window.setInterval(checkCookie, 100);
      setIntervalHandler(handler);
    }
  }, []);

  const checkCookie = (function () {

    var lastCookie = document.cookie; 
    return function () {
      var currentCookie = document.cookie; 
      if (currentCookie != lastCookie) {
        lastCookie = currentCookie;
        console.log("cookie change");
        let token =
          Cookies.get("accessToken") != undefined
            ? Cookies.get("accessToken")
            : "no token";
        if (token == "no token") {
          console.log("token exprie...");
        }
        setToken(token ?? ""); 
      }
    };
  })();

  if (token != "") {
    setAuthToken(token);
  }

  let routes; 

  if (token === "") {
    routes = (
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        {}
        <Route path="*">
          <h1>Erreur 404</h1>
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <>
        <Dashboard />
      </>
    );
  }

  return (
    <Router>
      <div className="container">{fetchingToken ? <Loader /> : routes}</div>
    </Router>
  );
}
module.exports =  App;
