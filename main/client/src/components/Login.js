import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
const login = require( "../api/connexion.js");
import Cookies from "js-cookie";
import { useState } from "react";

function Login() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log("La forme des valeurs est: ", values);
      const answ = await login(values);
      console.log(answ);
      var in15minutes = new Date(new Date().getTime() + 900000);
      Cookies.set("accessToken", answ.data.accessToken, {
        expires: in15minutes,
      });
      localStorage.setItem("refreshToken", answ.data.refreshToken);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      <Form name="normal_login" className="auth-form" onFinish={onFinish}>
        <h2 className="container_title">Connexion</h2>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Saissir email",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Saissir mot de passe",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Mot de passe"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={loading}
            loading={loading}
          >
            Connexion
          </Button>
          <span
            style={{
              margin: "0 1rem",
            }}
          >
            {" "}
            Ou
          </span>{" "}
          <Button
            type="link"
            onClick={(_) => {
              history.push("/signup");
            }}
          >
            {" "}
            Inscrivez-vous
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
module.exports = Login;
