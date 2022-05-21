import { Form, Input, Button } from "antd";
import { useHistory } from "react-router-dom";
const  signup = require ("../api/connexion.js");
import Cookies from "js-cookie";
import { useState } from "react";

function Signin() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      delete values.confirm;
      const answ = await signup(values);
      console.log(answ.data);
      var in15minutes = new Date(new Date().getTime() + 900000);
      Cookies.set("accessToken", answ.data.accessToken, {
        expires: in15minutes,
      });
      localStorage.setItem("refreshToken", answ.data.refreshToken);
      history.push("/");
    } catch (err) {
      setLoading(false);
      console.log({ err });
    }
  };
  return (
    <div className="auth-container">
      <Form name="normal_login" className="auth-form" onFinish={onFinish}>
        <h2 className="container_title">SignUp</h2>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Email invalid",
            },
            {
              required: true,
              message: "Saisir email",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            {
              required: true,
              message: "Saisir mot de passe",
            },
          ]}
        >
          <Input.Password type="password" placeholder="Mot de passe" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmer mot de passe"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Confirmer mot de passe",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Les deux mots de passe que vous avez saisis ne se correspondent pas")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmer mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={loading}
            loading={loading}
          >
           Inscription
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
              history.push("/");
            }}
          >
            Connexion{" "}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

module.exports = Signin;
