import React from "react";
import { Switch, Route } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Dashboard() {
  return (
    <div className="frame">
      <Switch>

        <Route exact path="/">
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
        </Route>

        <Route path="" render={() => <h1>Erreur 404</h1>} />
      </Switch>
    </div>
  );
}

module.exports =  Dashboard;
