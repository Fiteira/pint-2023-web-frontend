import "./style.css";
import api from "../../services/api";
import React, { useState, useEffect } from "react";
import * as Icon from 'react-bootstrap-icons';
import { useHistory } from "react-router-dom";
import { useToast } from '../../components/toasts/toast';

const id = localStorage.getItem("IDUtilizador");


function ProfilePage() {
  const [candidaturas, setCandidaturas] = useState([]);
  const history = useHistory();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState("");
  const [userImagem, setUserImagem] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cv, setCV] = useState("");
  const [cvLink, setCVLink] = useState("");
  const { showSuccessToast, showErrorToast } = useToast();




  async function SubmeterDados(Nome, Telefone, Linkedin, Foto, CV) {
    console.log("Foto:", Foto);
    console.log("CV:", CV);

    try {
        const formData = new FormData();

        if (Foto) {
            const arquivo = Foto[0];
            formData.append("imagem", arquivo);
        }

        if (CV) {
            formData.append("ficheiro", CV);
        }

        const [responseFoto, responseCV] = await Promise.all([
            Foto ? api.post("/api/imagem", formData) : null,
            CV ? api.post("/api/ficheiro", formData) : null
        ]);

        const urlImagem = responseFoto?.data.message;
        const urlPdf = responseCV?.data.message;

        // Cria um objeto com os campos a serem enviados para a API
        const dadosUsuario = {
            Nome,
            Telefone,
            Linkedin
        };

        // Adiciona os campos de imagem e PDF apenas se tiverem valores válidos
        if (urlImagem) {
            dadosUsuario.Foto = urlImagem;
        }

        if (urlPdf) {
            dadosUsuario.CV = urlPdf;
        }

        await api.put(`/api/usuarios/${id}`, dadosUsuario);

        showSuccessToast("Alterações feitas com sucesso!")
        window.location.reload(true);

    } catch (err) {
        console.log(err);
    }
}

  const handleSelectedFile = (event) => {
    if (event.target.files[0].type.startsWith("image/")  || (event.target.files[0] && event.target.files[0].length > 0) ) {
      setImagem(event.target.files);
      const temporaryUrl = URL.createObjectURL(event.target.files[0]);
      setUserImagem(temporaryUrl);
    } else {
      showErrorToast("Utilize o formato de ficheiro correto!");
      event.target.value = "";
    }
    if (event.target.files.size > 5000000) {
      showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!")
      event.target.value = "";
    }
  };
  const handleSelectedFilePDF = (event) => {
    const file = event.target.files[0];

    if (file === undefined) {

        setCV("")
        return
    }
    if (file.size > 5000000) {
      showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!")
      event.target.value = "";
    }
    if (file.type === "application/pdf"  || (file && file.length > 0) ) {
      // O arquivo selecionado é um arquivo PDF
      setCV(file);
    } else {
      // O arquivo selecionado não é um arquivo PDF, exibe um alerta
      showErrorToast("Utilize o formato de ficheiro correto!");
      event.target.value = "";
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    SubmeterDados(nome, telefone, linkedin, imagem, cv);
  };
  
  useEffect(() => {
    async function fetchVagas() {
      const response = await api.get(`/api/candidaturas?nusuario=${id}`);
      setCandidaturas(response.data.message);
    }

    async function fetchUser() {
      const response = await api.get(`/api/usuarios/${id}`);
      setNome(response.data.message.Nome);
      setEmail(response.data.message.Email);
      setTelefone(response.data.message.Telefone);
      setUserImagem(response.data.message.Foto);
      setLinkedin(response.data.message.Linkedin);
      setCVLink(response.data.message.CV);
    }
    fetchVagas();
    fetchUser();
  }, []);




  return (
    <>  {!userImagem ? (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
      </div>
    ) :(
    <div className="container mt-6">
      <div className="row">
        <div className="col-md-1"/>
        <h2 className="col-4 text-start">Perfil</h2>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-4">
        <div className="text-start">
          <label htmlFor="nome">Nome:</label>
          <input type="text" className="form-control" value={nome} id="nome" onChange={(event) => setNome(event.target.value)} />
        </div>
        <div className="text-start">
          <label htmlFor="nome">Email:</label>
          <input type="text" className="form-control" value={email} id="nome" readOnly  />
        </div>
        <div className="text-start">
          <label htmlFor="telefone">Telefone:</label>
          <input type="text" className="form-control" value={telefone} id="telefone" onChange={(event) => setTelefone(event.target.value)} />
        </div>
        <div className="text-start">
          <label htmlFor="linkedin">Linkedin:</label>
          <input type="text" className="form-control" value={linkedin} id="linkedin" onChange={(event) => setLinkedin(event.target.value)} />
        </div>
        <br/>
        <div className="d-flex align-items-center">
            <label htmlFor="cv" className="mr-2">Curriculum:&nbsp;&nbsp;</label>
          <div className="text-start input-group w-100">
            {cvLink ? (
              <>
                <button className="btn btn-primary" onClick={() => cvLink && window.open(cvLink, '_blank')}>Curriculum Vitae anterior</button>
                <label className="input-group-text" htmlFor="inputGroupFileCurriculum">
                  <Icon.Pencil/>
                </label>
              </>
            ) : (
              <>
                <label className="input-group-text" id="btnAdicionarCV" htmlFor="inputGroupFileCurriculum">
                  Adicionar Curriculum&nbsp;<Icon.PlusLg/>
                </label>
                <b/>
              </>
            )}
          </div>
        </div>
      
        <br/>
          <input type="file" accept=".pdf" max-size="5000000" className={`form-control-file ${cv ? '' : 'd-none'}`} id="inputGroupFileCurriculum" onChange={handleSelectedFilePDF} /> 
        <br/><br/>
    </div>
      <div className="col-md-1" />
      <div className="col-md-4">
        
        <div className="float-right">
            <img src={userImagem} alt="Foto do usuário" className="img-thumbnail img-fluid rounded-circle" id="foto-preview" style={{ width: '300px', height: '300px' }}/>
        </div>
        <div className="row mt-2">
          <div className="col-md-4"/>
          <div className="col-md-5">
            <label className="input-group-text" htmlFor="inputGroupFileImagem" >
            &nbsp;&nbsp;Editar Imagem &nbsp;<Icon.Pencil/>
            </label>
          </div>
          
        </div>
        <input type="file" className="form-control-file d-none" id="inputGroupFileImagem" onChange={handleSelectedFile} />
       
        <br/>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-secondary float-right" onClick={handleSubmit}>
            Guardar Alterações <Icon.Save/>
          </button>
        </div> 
      </div>
        
      </div>
          <div className="mt-5">
          <h2 className="col-6">Histórico de Candidaturas</h2>
          {candidaturas.length === 0 ? (
            <table className="table table-striped w-75 mx-auto table-bordered">
              <thead>
                <tr>
                  <th scope="col">Título da candidatura</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Não existem candidaturas associadas ao perfil</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="table table-striped w-75 mx-auto table-bordered">
              <thead>
                <tr>
                  <th scope="col">Título</th>
                  <th scope="col">Data de candidatura</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidaturas.map((candidatura) => (
                  <tr key={candidatura.NCandidatura}>
                    <td>{candidatura.NomeVaga}</td>
                    <td>{new Date(candidatura.DataCandidatura).toLocaleDateString()}</td>
                    <td className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary transparent-btn float-right"
                        onClick={() => history.push(`/vagas/${candidatura.NVaga}`)}>Mostrar mais</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
       
          </div>
            
  </div>)}  
    
    </>
    
  );
}

export { ProfilePage };
