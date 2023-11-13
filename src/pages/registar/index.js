import { format, subYears } from "date-fns";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import facebook from "../../assets/facebook.jpeg";
import google from "../../assets/google.png";
import { useToast } from "../../components/toasts/toast";
import api from "../../services/api";
import "./style.css";

function RegistoPage({ verificarAutenticacao }) {
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [genero, setGenero] = useState("");
  const [data, setData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const minDate = subYears(new Date(), 120);
  const maxDate = new Date();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    const dataFormatada = format(new Date(data), "yyyy/MM/dd");

    if (password !== passwordConfirm) {
      showErrorToast("As palavras-passe não são iguais. Tente novamente.");
      setSubmitting(false);
      return;
    }
    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirm ||
      !genero ||
      !dataFormatada
    ) {
      showErrorToast("Preencha todos os campos.");
      setSubmitting(false);
      return;
    }

    if (errorMessage) {
      setSubmitting(false);
      showErrorToast("A palavra-passe não cumpre as regras.");
      return;
    }

    api
      .post("/api/register", {
        Email: email,
        Nome: name,
        Senha: password,
        Genero: genero,
        DataNascimento: dataFormatada,
      })
      .then((user) => {
        setShowModal(true);
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        showErrorToast(err.response.data.message);
      });
  };
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[^\s]{6,}$/;

    if (!value) {
      setErrorMessage("");
      setSubmitting(false);
    } else if (!regex.test(value)) {
      setSubmitting(false);
      setErrorMessage(
        "A palavra-passe deve conter pelo menos uma letra maiúscula ou minúscula, um número e ter um comprimento mínimo de 6 caracteres, sem permitir espaços em branco."
      );
    } else {
      setSubmitting(false);
      setErrorMessage("");
    }
  };

  function handleDataChange(date) {
    setData(date);
  }

  function handleClickLogIn() {
    history.push("/login");
  }

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

        setTimeout(() => {
          history.push("/");
        }, 1000);

        authWindow.close();
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    history.push("/login");
  };
  const handleChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
    validatePassword(value);
  };
  return (
    <div className="container mt-6">
      <div className="registar-container">
        <div className="row justify-content-center m-auto">
          <div className="offset- col-lg-5 col-md-7 ">
            <div className="panel border bg-white">
              <div className="panel-heading">
                <h3 className="pt-3 font-weight-bold">Registar</h3>
              </div>
              <div className="panel-body p-3">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Nome *</label>
                    <input
                      type="text"
                      className="form-control "
                      id="name"
                      placeholder="Digite seu nome"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Palavra-Passe *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Palavra-Passe"
                      value={password}
                      onChange={handleChangePassword}
                      required
                    />
                    {errorMessage && (
                      <div className="text-danger">{errorMessage}</div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Confirmar palavra-passe *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordconfirm"
                      placeholder="Confirmar palavra-passe"
                      value={passwordConfirm}
                      onChange={(event) =>
                        setPasswordConfirm(event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="genero">Género *</label>
                    <select
                      value={genero}
                      className="form-select mb-3"
                      aria-label="Default select example"
                      onChange={(event) => setGenero(event.target.value)}
                      required
                    >
                      <option value="">Escolha o género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="data">Data de Nascimento:</label>
                    <DatePicker
                      className="w-100"
                      selected={data}
                      onChange={handleDataChange}
                      minDate={minDate}
                      maxDate={maxDate}
                      yearDropdownItemNumber={100}
                      scrollableYearDropdown
                      showYearDropdown
                      id="data"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-3 w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Enviando..." : <>Registar</>}
                  </button>
                  <div className="text-center text-muted">
                    Já tem uma conta?{" "}
                    <button className="btn" onClick={handleClickLogIn}>
                      Log In
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
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registo feito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Verifique a conta, acedendo ao link que foi enviado para: {email}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export { RegistoPage };
