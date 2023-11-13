import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import api from '../../services/api';
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';
const ModalEditarBeneficios = ({ show, onHide,beneficio}) => {

    const [nomeBeneficio, setNomeBeneficio] = useState(beneficio.NomeBeneficio);
    const [subtitulo, setSubtitulo] = useState(beneficio.Subtitulo);
    const [descricao, setDescricao] = useState(beneficio.Descricao);
    const {showSuccessToast,showErrorToast} = useToast();
    const imagemAntiga = beneficio.EnderecoImagem;

    const [imagem, setImagem] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [isUserDataEdited, setIsUserDataEdited] = useState(false);


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

    if(imagem)    
    {
        const formData = new FormData();

        const arquivo = imagem[0];
        formData.append("imagem", arquivo);
        formData.append("width", 442);
        formData.append("height", 132);

        const responseImagem = await api.post("/api/imagem", formData)
        
  
        const imagemLink = responseImagem.data.message;


        if(imagemLink)
        {
          api.put(`/api/beneficios/${beneficio.NBeneficio}`, {
            Descricao:descricao,
            NomeBeneficio:nomeBeneficio,
            Subtitulo:subtitulo,
            EnderecoImagem:imagemLink 
        }).then(beneficios => {
            console.log(beneficios);
            setSubmitting(false);
            showSuccessToast("Enviado com sucesso")
            }).catch(err => {
               console.log(err);
               setSubmitting(false);
            })
        }
      return
    }  
       
    
    if(isUserDataEdited){

        console.log(imagemAntiga);

        api.put(`/api/beneficios/${beneficio.NBeneficio}`, {
            Descricao:descricao,
            NomeBeneficio:nomeBeneficio,
            Subtitulo:subtitulo,
            EnderecoImagem:imagemAntiga 
        }).then(beneficios => {
            console.log(beneficios);
            
            showSuccessToast("Enviado com sucesso")
            onHide();

            }).catch(err => {
               console.log(err);
            })
        
    } 
  }

    return (
        <Modal show={show} onHide={onHide} size="xl">
        <form onSubmit={handleSubmit} >
          <Modal.Header closeButton>
            <Modal.Title>Editar Benefício<br/></Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='row'>
                <div className='col-md-4'>
                  <label htmlFor="name">Nome Benefício:</label>
                  <input type="text" className='form-control'  value={nomeBeneficio} onChange={(event) => {setNomeBeneficio(event.target.value);setIsUserDataEdited(true);}} /><br />

                  <label htmlFor="name">Subtítulo:</label>
                  <input type="text" className='form-control' value={subtitulo} onChange={(event) => {setSubtitulo(event.target.value);setIsUserDataEdited(true);}} /><br />
                </div>
                <div className='col-md-8'>
                  <label htmlFor="name">Descrição:</label>
                  <textarea type="text" className='form-control' style={{ height: '150px', width: "100%" }} value={descricao} onChange={(event) => {setDescricao(event.target.value);setIsUserDataEdited(true);}} /><br />
                </div>
              </div> 
            {previewImage ? (
              <> 
                <label htmlFor="foto" className="float-right">Preview Foto:</label>
                <div className="float-right">
                  <img src={previewImage} alt="Foto do usuário" className="img-thumbnail img-fluid" id="foto-preview" style={{ width: "454px", height: "200px" }} />
                </div>
              </>
            ):( <>  
                <label htmlFor="foto" className="float-right">Antiga Foto:</label>
                <div className="float-right">
                <img src={imagemAntiga} alt="Foto do usuário" className="img-thumbnail img-fluid" id="foto-preview" style={{ width: "454px", height: "200px" }} />
            </div></>
          )}
            <label htmlFor="foto" className="float-right">Foto:</label><br />
            <input type="file" accept="image/*" className="form-control-file" id="foto" onChange={handleSelectedFile} />

          </Modal.Body>
          <Modal.Footer>
          <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : <>Editar <Icon.SendFill/></>}
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Fechar <Icon.XLg/>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
  
  export default ModalEditarBeneficios;