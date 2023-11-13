import React, { useState, useEffect } from "react";
import "./style.css";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

function Usuarios() {
  const [usuario, setUsuario] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const history = useHistory();
  const [atualizarLista, setAtualizarLista] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      const response = await api.get("api/usuarios");

      setUsuario(response.data.message);
      setIsLoading(false);
    }

    fetchUsuarios();
  }, [atualizarLista]);

  useEffect(() => {
    async function fetchCargos() {
      const response = await api.get("api/cargos");
      setCargo(response.data.message);
    }

    fetchCargos();
  }, []);

  const getDescricaoCargo = (NCargo) => {
    const cargoEncontrado = cargo.find((cargo) => cargo.NCargo === NCargo);
    return cargoEncontrado ? cargoEncontrado.Cargo : "";
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsuarios = usuario.filter((usuario) => {
    const { Nome, Email, NCargo } = usuario;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseCargo = getDescricaoCargo(NCargo).toLowerCase();
    
    return (
      Nome.toLowerCase().includes(lowerCaseQuery) ||
      Email.toLowerCase().includes(lowerCaseQuery) ||
      lowerCaseCargo.includes(lowerCaseQuery)
    );
  });
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border mx-auto my-auto" style={{ width: "3rem", height: "3rem" }} role="status" />
        </div>
      ) : (
        <div className="container mt-6">
          <div className="row-md-12 row p-3">
            <h1 className="col-md-2">Utilizadores</h1>
            <div className="col-md-3"></div>
            <div className="col-md-7 d-flex justify-content-end">
              <div className="col-md-7 offset-2 px-2">
                <input type="search" className="form-control align-self-center" placeholder="Procurar por nome, email ou cargo" value={searchQuery} onChange={handleSearchChange} />
              </div>
              <button type="button" className="btn btn-primary mb-2 align-self-center" onClick={() => history.push("/criarutilizador")}>
                Criar Utilizador&nbsp;
                <Icon.PlusLg />
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <table className="table table-striped w-100  table-bordered">
              <thead>
                <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Estado</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((usuario) => (
                  <tr key={usuario.NUsuario}>
                    <td>{usuario.NUsuario}</td>
                    <td>{usuario.Nome}</td>
                    <td>{usuario.Email}</td>
                    <td>{getDescricaoCargo(usuario.NCargo)}</td>
                    <td>
                      <div className="row w-auto">
                        <div className="col-md-10">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`flexSwitchCheck${usuario.Estado === 0 ? "Default" : "Checked"}`}
                              checked={usuario.Estado === 0 ? false : true}
                              onChange={async () => {
                                // Altera o estado da conta para o valor oposto
                                const novoEstado = usuario.Estado === 0 ? 1 : 0;
                                await api.put(`api/disableuser/${usuario.NUsuario}`, { Estado: novoEstado }).then(() => {
                                  // Atualiza a página após a alteração do estado
                                  setAtualizarLista(atualizarLista + 1);
                                });
                              }}
                            />
                            <label className="form-check-label" htmlFor={`flexSwitchCheck${usuario.Estado === 0 ? "Default" : "Checked"}`}>
                              {usuario.Estado === 0 ? "Ativar Conta" : "Desativar Conta"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="col-md-9">
                        <button type="button" className="btn btn-outline-primary transparent-btn mx-2" onClick={() => history.push(`/utilizadores/${usuario.NUsuario}`)}>
                          Mostrar mais
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export { Usuarios };