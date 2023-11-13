import React, { useState } from 'react';
import ModalBeneficios from './Modal';
import ModalEditarBeneficios from './ModalEditar';
import Alert  from '../../components/alerts/alerts';
import api from '../../services/api';
import * as Icon from 'react-bootstrap-icons';
const Card = ({ beneficio ,cargo,AtualizarLista }) => {

  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [showMensagem, setShowMensagem] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalEditar = () => {
    setShowModalEditar(false);
    AtualizarLista()
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const removerBeneficio = () =>{

    api.delete(`/api/beneficios/${beneficio.NBeneficio}`).then(beneficios => {
        
      console.log(beneficios);
      setShowMensagem(true);
      AtualizarLista()
      
    }).catch(err => {
        console.log(err);

    })

  }

  return (
    <div className="col-lg-6 mb-4" >
      <div className="card card-hover"> 
      <div className="card">
        <img src={beneficio.EnderecoImagem} className="card-img-top" alt="ImagemBeneficio" style={{ height: "200px" }} />
        <div className="card-body">
          <h5 className="card-title">{beneficio.NomeBeneficio}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{beneficio.Subtitulo}</h6>
          
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>Saiba mais </button>&nbsp;&nbsp;
            {cargo === "0" ? (
            <>
                <button type="button" className="btn btn-primary " onClick={() => setShowModalEditar(true)} >Editar <Icon.PencilFill/></button>&nbsp;&nbsp;
                <button type="button" className="btn btn-primary " onClick={() => setShowAlert(true)} >Remover <Icon.TrashFill/></button>
            </>
              ) : null}
          </div>
         
          <ModalBeneficios
            show={showModal}
            onHide={handleCloseModal}
            nome={beneficio.NomeBeneficio}
            subtitulo={beneficio.Subtitulo}
            descricao={beneficio.Descricao}
            />

            <ModalEditarBeneficios
            show={showModalEditar}
            onHide={handleCloseModalEditar}
            beneficio={beneficio}
            />

          <Alert
          show={showAlert}
          onHide={handleCloseAlert}
          nome="Remover Benefício"
          click={removerBeneficio}
          mensagem="Foi removida o beneficio com sucesso"
          enviadoComSucesso={showMensagem}
          />
          

        </div>
      </div>
      </div>
    </div>
  );
};

export default Card;