import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';
const ModalRecomendar = ({ show, onHide, IdVaga,IdUtilizador }) => {

  

    const [NomeCand, setNomeCand] = useState('');
    const [EmailCand, setEmailCand] = useState('');
    const [TelefoneCand, setTelefoneCand] = useState('');
    const [LINKEDIN, setLINKEDIN] = useState('');
    const [CV, setCV] = useState('');
    const {showErrorToast, showSuccessToast} = useToast();  
    const NVaga = IdVaga;
    const NUsuario = IdUtilizador;


    const [submitting, setSubmitting] = useState(false);


    async function handleSubmit (event) {
        event.preventDefault();
        
        if (submitting) {
            return;
        }
  
        setSubmitting(true);


        const formData = new FormData();

        const recomendarCand = {
            NVaga,
            NUsuario,
            NomeCand,
            TelefoneCand,
            EmailCand, 
            LINKEDIN,
        };
        
        if(CV) {
    
            formData.append("ficheiro", CV);
            const responseCV = await api.post("/api/ficheiro", formData);
            const urlPdf = responseCV.data.message;
        
            if (urlPdf && urlPdf !== recomendarCand.CV) {
                recomendarCand.CV = urlPdf;
            }
    
        } 
        api.post("/api/indicacoes" , recomendarCand).then(indicacoes => {
            setSubmitting(false);
           console.log(indicacoes);
           showSuccessToast("Enviado com sucesso")
           onHide();


        }).catch(err => {
            setSubmitting(false);
            console.log(err);
            showErrorToast(err.response.data.message)
        })
    }    

    const handleSelectedFilePDF = (event) => {
        
        const file = event.target.files[0];
        if (file.size > 5000000) {
            setSubmitting(false);
            showErrorToast("O arquivo deve ter menos de 5MB, escolha outro ficheiro!")
            event.target.value = "";
          }
        if (file.type === "application/pdf"  || (file && file.length > 0) ) {

          setCV(file);

        } else {
            setSubmitting(false);
            showErrorToast("Selecione o tipo de ficheiro correto!")
            event.target.value = "";
        }
      };

    return (  
    
    <>
    <Modal show={show} onHide={onHide}>
     <form onSubmit={handleSubmit} >
        <Modal.Header closeButton>
        <Modal.Title>Formulário de Recomendação</Modal.Title>
        </Modal.Header>

        <Modal.Body> 
            <label htmlFor="name">Nome:*</label><br />
            <input type="text" className='form-control' value={NomeCand} onChange={(event) => setNomeCand(event.target.value)} required/><br />
            
            <label htmlFor="email">Email:*</label><br />
            <input type="text" className='form-control' value={EmailCand} onChange={(event) => setEmailCand(event.target.value)} required/><br />
            
            <label htmlFor="phone">Telefone:</label><br />
            <input type="text" className='form-control' value={TelefoneCand} onChange={(event) => setTelefoneCand(event.target.value)} /><br />
        
            <label htmlFor="linkedin">LinkedIn:</label><br />
                <input type="text"  className='form-control' value={LINKEDIN} onChange={(event) => setLINKEDIN(event.target.value)}/><br />
        
            <label htmlFor="cv">CV:</label><br />
            <input type="file" accept=".pdf" max-size="5000000" className="form-control-file" id="cv" onChange={handleSelectedFilePDF} /><br/><br />
        </Modal.Body>

        <Modal.Footer>
            
            <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : <>Enviar <Icon.SendFill/></>}  
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
  
  export default ModalRecomendar;
