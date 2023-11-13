import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useState,useRef } from 'react';
import api from '../../services/api';
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';
const ModalCriarBeneficios = ({ show, onHide}) => {
    const {showSuccessToast,showErrorToast} = useToast();
    const nomeBeneficio = useRef('');
    const subtitulo = useRef('');
    const descricao = useRef('');
    const [imagem, setImagem] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [submitting, setSubmitting] = useState(false);

  const handleSelectedFile = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      showErrorToast("Selecione uma imagem");
      return;
    }

    if (selectedFile.size > 5000000) {
      showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!");
      event.target.value = "";
      return;
    }
   
    if (selectedFile.type.startsWith("image/")) {
      setImagem([selectedFile]);
  
      const temporaryUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(temporaryUrl);
    } else {
      showErrorToast("Selecione uma imagem");
    }
  };

  async function handleSubmit (event) {
    event.preventDefault();


    if (submitting) {
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();

    const arquivo = imagem[0];
    formData.append("imagem", arquivo);
    formData.append("width", 442);
    formData.append("height", 132);

    const responseImagem = await api.post("/api/imagem", formData);

    const imagemLink = responseImagem.data.message;


    console.log(imagemLink);

    api.post("/api/beneficios", {
      Descricao:descricao.current.value,
      NomeBeneficio:nomeBeneficio.current.value,
      Subtitulo:subtitulo.current.value,
      EnderecoImagem:imagemLink }
    
    ).then(beneficios => {
      setSubmitting(false);
      console.log(beneficios);

      showSuccessToast("Enviado com sucesso")

    }).catch(err => {
        console.log(err);
        setSubmitting(false);
    })
  } 


    return (
        <Modal show={show} onHide={onHide} size="xl">
        <form onSubmit={handleSubmit} >
          <Modal.Header closeButton>
            <Modal.Title>Criar Benefício <br/> </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='row'>
                <div className='col-md-4'>
                  <label htmlFor="name">Nome Benefício:</label>
                  <input type="text" className='form-control' ref={nomeBeneficio} required/><br />

                  <label htmlFor="name">Subtítulo:</label>
                  <input type="text" className='form-control' ref={subtitulo} required/><br />
                </div>
                <div className='col-md-8'>
                  <label htmlFor="name">Descrição:</label>
                  <textarea type="text" className='form-control' style={{ height: '150px', width: "100%" }} ref={descricao} required/><br />
                </div>
              </div> 
            {previewImage ? (
              <> 
                <label htmlFor="foto" className="float-right">Preview Foto:</label>
                <div className="float-right">
                  <img src={previewImage} alt="Foto do usuário" className="img-thumbnail img-fluid" id="foto-preview" style={{ width: "454px", height: "200px" }} />
                </div>
              </>
            ):(null)}
            <label htmlFor="foto" className="float-right">Foto:</label><br />
            <input type="file" accept="image/*" className="form-control-file" id="foto" onChange={handleSelectedFile} required />

          </Modal.Body>
          <Modal.Footer>
          <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : <>Enviar <Icon.SendFill/></>}
            </Button>
            <Button variant="secondary" onClick={onHide} > 
              Fechar <Icon.XLg/>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
  
  export default ModalCriarBeneficios;