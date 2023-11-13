import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';
const ModalCandidatar = ({ show, onHide, IdVaga, IdUtilizador, NomeVaga }) => {
  const [data, setData] = useState({});
  const [cv, setCV] = useState(null);
  const [telefone, setTelefone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cvLink, setCVLink] = useState("");
  const [pretensao, setPretensao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isUserDataEdited, setIsUserDataEdited] = useState(false);
  const {showErrorToast, showSuccessToast} = useToast();  

  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();

  const NVaga = IdVaga;
  const NUsuario = IdUtilizador;

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!cv && !cvLink) {
      showErrorToast("Por favor, carregue um CV.");
      return;
    }

    api
      .post("/api/candidaturas", {
        NVaga,
        NUsuario,
        PretencaoSalarial: pretensao,
        Mensagem: mensagem,
      })
      .then((candidatura) => {
        showSuccessToast("Enviado com sucesso")
        history.push("/vagas");
        setSubmitting(true);
      })
      .catch((err) => {
        setSubmitting(false);
        showErrorToast(err.response.data.message);
        onHide();
        console.log(err);
      });

    const formData = new FormData();

    const dadosUsuario = {
      Telefone: telefone,
      Linkedin: linkedin,
    };

    if (cv) {
      formData.append("ficheiro", cv);
      const responseCV = await api.post("/api/ficheiro", formData);
      const urlPdf = responseCV.data.message;

      if (urlPdf && urlPdf !== dadosUsuario.CV) {
        dadosUsuario.CV = urlPdf;
      }
    }

    if (isUserDataEdited) {
      await api.put(`/api/usuarios/${NUsuario}`, dadosUsuario);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const response = await api.get(`/api/usuarios/${NUsuario}`);
      setData(response.data.message);
      setCVLink(response.data.message.CV);
      setTelefone(response.data.message.Telefone);
      setLinkedin(response.data.message.Linkedin);
    }
    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectedFilePDF = (event) => {
    const file = event.target.files[0];
    if (file.size > 5000000) {
      showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!")
      event.target.value = "";
    }
    if (file.type === "application/pdf"  || (file && file.length > 0)) {
      setCV(file);
      setIsUserDataEdited(true);
    } else {
      setSubmitting(false);
      showErrorToast("Escolha o formato de ficheiro correto!")
      event.target.value = "";
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl">
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Candidatura para <i>{NomeVaga}</i></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-flex m-5 row">
              <div className="float-start col-5">
                <label htmlFor="name">Nome:</label><br />
                <input type="text" id="name" className='form-control' name="name" value={data.Nome} readOnly /><br />

                <label htmlFor="email">Email:</label><br />
                <input type="text" id="email" className='form-control' name="email" value={data.Email} readOnly /><br />

                <label htmlFor="phone">Telefone:</label><br />
                <input type="tel" id="phone" pattern="[9][0-9]{8}" className='form-control' name="phone" value={telefone} onChange={(event) => { setTelefone(event.target.value); setIsUserDataEdited(true) }} /><br />

                <label htmlFor="linkedin">LinkedIn:</label><br />
                <input type="text" id="linkedin" className='form-control' name="linkedin" value={linkedin} onChange={(event) => { setLinkedin(event.target.value); setIsUserDataEdited(true) }} /><br />
                <strong>Pode atualizar o seu currículo ou adicionar um!</strong>
                <label htmlFor="cv">Currículo:</label><br />
                <input type="file" accept=".pdf"  className="form-control-file" id="cv" onChange={handleSelectedFilePDF} required={cvLink ? false : true} /><br />

                {cvLink && (
                  <>
                    <br />
                    <button type="button" className="btn btn-primary" onClick={() => cvLink && window.open(cvLink, '_blank')}>Currículo Vitae anterior</button>
                  </>
                )}
              </div>
              <div className="float-end col-6">
                <label htmlFor="pretensao">Pretensão salarial:</label><br />
                <input type="number" className='form-control' value={pretensao} onChange={(event) => setPretensao(event.target.value)} required /><br />
                <label htmlFor="mensagem">Mensagem:</label><br />
                <textarea type="text" className='form-control' value={mensagem} style={{ height: '200px', width: "100%" }} onChange={(event) => setMensagem(event.target.value)} required /><br />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>

            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Enviado" : <>Submeter <Icon.SendFill/></>}
            </Button>
            &nbsp;&nbsp;
            <Button variant="secondary" onClick={onHide}>
              Cancelar <Icon.XLg/>
            </Button>
            
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default ModalCandidatar;