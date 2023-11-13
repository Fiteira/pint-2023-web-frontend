import React, { useState } from "react";
import { Button } from "react-bootstrap";
import {
  Envelope,
  EyeFill,
  EyeSlashFill,
  LockFill,
} from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import facebook from "../../assets/facebook.jpeg";
import google from "../../assets/google.png";
import { useToast } from "../../components/toasts/toast";
import api from "../../services/api";
import "./styles.css";

function LoginPage({ verificarAutenticacao }) {
  let history = useHistory();
  const { showSuccessToast, showErrorToast } = useToast();
  const [Email, setEmail] = useState("");
  const [Senha, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    try {
      const user = await api.post("/api/login", { Email, Senha });
      localStorage.setItem("token", user.data.message); // guardar o token no localStorage

      await verificarAutenticacao();
      const currentHour = new Date().getHours();
      let greeting;
      let nome = localStorage.getItem("NomeUtilizador");
      if (currentHour >= 5 && currentHour < 12) {
        greeting = "Bom dia";
      } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Boa tarde";
      } else {
        greeting = "Boa noite";
      }
      showSuccessToast(`${greeting}, ${nome}. Seja bem-vindo!`);

      const cargo = localStorage.getItem("Cargo");

      if (cargo === "0") {
        history.push("/reporting");
      } else if (cargo === "3") {
        history.push("/oportunidades");
      } else if (cargo === "4") {
        history.push("/ideias");
      } else if (cargo === "5") {
        history.push("/dashboard");
      } else {
        history.push("/");
      }
    } catch (err) {
      console.log(err);

      if (err.code === "ERR_NETWORK") {
        showErrorToast("Erro de Conexão");
      } else {
        showErrorToast(err.response.data.message);
      }
    }
  };

  const loginFacebook = (event) => {
    event.preventDefault();
    const authUrl = `${process.env.REACT_APP_BASE_URL}/api/facebook`;

    const authWindow = window.open(authUrl, "_blank", "width=500,height=600");

    let messageContent;

    window.addEventListener("message", (event) => {
      event.preventDefault();

      if (event.data && event.data.accessToken) {
        messageContent = event.data;

        console.log("Login sucedido facebook");

        localStorage.setItem("token", messageContent.accessToken);
        verificarAutenticacao();
        setTimeout(() => {
          history.push("/");
        }, 1000);

        authWindow.close();
      }
    });
  };

  const loginGoogle = (event) => {
    event.preventDefault();
    const authUrl = `${process.env.REACT_APP_BASE_URL}/api/google/callback`;

    const authWindow = window.open(authUrl, "_blank", "width=500,height=600");

    let messageContent;

    window.addEventListener("message", (event) => {
      event.preventDefault();

      if (event.data && event.data.accessToken) {
        messageContent = event.data;

        localStorage.setItem("token", messageContent.accessToken);
        verificarAutenticacao();

        setTimeout(() => {
          history.push("/");
        }, 1000);

        authWindow.close();
      }
    });
  };

  const handleClickEsquecer = () => {
    history.push("/recuperarpass");
  };

  const handleClickRegistar = () => {
    history.push("/registar");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit(event);
    }
  };

  return (
    <div className="container mt-6 justify-content-center align-items-center">
      <div className="login-container" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="row justify-content-center m-auto">
          <div className="offset- col-lg-5 col-md-7">
            <div className="panel border bg-white">
              <div className="panel-heading">
                <h3 className="pt-3 font-weight-bold">Iniciar Sessão</h3>
              </div>
              <div className="panel-body p-3">
                <form onSubmit={submit}>
                  <div className="form-group py-2">
                    <div className="input-field">
                      <Envelope className="p-2 text-muted" />
                      <input
                        className="form-control"
                        value={Email}
                        type="text"
                        placeholder="Email"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group py-1 pb-2">
                    <div className="input-field">
                      <LockFill className="px-2 text-muted" />
                      <input
                        className="form-control"
                        value={Senha}
                        type={showPassword ? "text" : "password"}
                        placeholder="Palavra passe"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                      <button
                        className="btn bg-white text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </button>
                    </div>
                  </div>
                  <div className="form-inline">
                    <button
                      id="forgot"
                      className="btn font-weight-bold"
                      onClick={handleClickEsquecer}
                    >
                      Esqueceu a palavra passe?
                    </button>
                  </div>
                  <button className="btn btn-primary btn-block mt-3 w-100">
                    Iniciar Sessão
                  </button>
                  <div className="text-center pt-4 text-muted">
                    Não tem uma conta?{" "}
                    <button className="btn" onClick={handleClickRegistar}>
                      Registar
                    </button>{" "}
                  </div>
                </form>
              </div>
              <div className="mx-3 my-2 py-2 bordert">
                <div className="text-center py-3">
                  <Button
                    onClick={loginFacebook}
                    variant="transparent"
                    className="px-2"
                  >
                    <img src={facebook} alt="Facebook" />
                  </Button>

                  <Button
                    onClick={loginGoogle}
                    variant="transparent"
                    className="px-2"
                  >
                    <img src={google} alt="Google" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
