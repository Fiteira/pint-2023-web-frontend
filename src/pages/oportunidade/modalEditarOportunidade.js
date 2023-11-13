import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';

const ModalOportunidade = ({ show, onHide,oportunidade,optionsEmpresa,atulizarOportunidade}) => {
    
    const NUtilizador = localStorage.getItem('IDUtilizador');
    const cargo = localStorage.getItem('Cargo');
    const [optionsEtiquetas, setOptionsEtiquetas] = useState([]);
    const [optionsTipoProjetos, setOptionsTipoProjetos] = useState([]);
    const [selectedValueEmpresa, setSelectedValueEmpresa] = useState('');
    const [selectedValueEtiqueta, setSelectedValueEtiqueta] = useState('');
    const [selectedValueTipoProjeto, setSelectedValueTipoProjeto] = useState('');
    const {showSuccessToast, showErrorToast} = useToast();
    const [nomeEmpresa, setNomeEmpresa] = useState("");
    const [emailEmpresa, setEmailEmpresa] = useState("");
    const [telefoneEmpresa, setTelefoneEmpresa] = useState("");
    const [descricaoEmpresa, setDescricaoEmpresa] = useState("");

    const [titulo, setTitulo] = useState("");
    const [valor, setValor] = useState("");
    const [mensagem, setMensagem] = useState("");
    
    const [adicionarEtiqueta, setAdicionarEtiqueta] = useState(1);
    const [novaEtiqueta, setNovaEtiqueta] = useState("");

    const [adicionarTipoProjeto, setAdicionaTipoProjeto] = useState(1);
    const [novoTipoProjeto, setNovoTipoProjeto] = useState("");

    const [isUserDataEditedEmp, setIsUserDataEditedEmp] = useState(false);
    const [isUserDataEdited, setIsUserDataEdited] = useState(false);
    
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchDataEtiquetas() {
          const response = await api.get('/api/etiquetas');
          const data = response.data.message;
          
           setOptionsEtiquetas(data);
        }
        fetchDataEtiquetas();
      }, []);

      useEffect(() => {
        async function fetchDataEtiquetas() {
          const response = await api.get('/api/tipoprojetos');
          const data = response.data.message;
          setOptionsTipoProjetos(data);
        }
        fetchDataEtiquetas();
      }, []);

      function handleChangeEmpresa(event) {
        setSelectedValueEmpresa(event.target.value);
        const empresaSelecionada = optionsEmpresa.find((empresa) =>  empresa.NCliente == event.target.value);
            
        if (empresaSelecionada) {
          setNomeEmpresa(empresaSelecionada.NomeEmp);
          setEmailEmpresa(empresaSelecionada.EmailEmp);
          setDescricaoEmpresa(empresaSelecionada.Descricao);
          setTelefoneEmpresa(empresaSelecionada.TelefoneEmp);
        } else {
          setNomeEmpresa("");
          setEmailEmpresa("");
          setDescricaoEmpresa("");
          setTelefoneEmpresa("");
        }
      }
       
       useEffect(() => {
        handleChangeEmpresa({ target: { value: oportunidade.NCliente }})
        }, [oportunidade.NCliente]);

        useEffect(() => {
            setSelectedValueEtiqueta(oportunidade.NEtiqueta)
        }, [oportunidade.NEtiqueta]);

        useEffect(() => {
            setSelectedValueTipoProjeto(oportunidade.NTipoProjeto)
        }, [oportunidade.NTipoProjeto]);

        useEffect(() => {

            setTitulo(oportunidade.Titulo);
            setValor(oportunidade.Valor);
            setMensagem(oportunidade.Descricao);
        }, [oportunidade.NOportunidade, oportunidade.Descricao, oportunidade.Titulo, oportunidade.Valor]);



    async function handleSubmit (event){

        event.preventDefault();

        if (submitting) {
            return;
          }
        setSubmitting(true);

        let nEtiqueta;
        let nCliente;
        let nTipoProjeto;

        if(oportunidade.NCliente === selectedValueEmpresa)
        {   
            if(isUserDataEditedEmp === true)
            {
                await api.put(`api/clientes/${selectedValueEmpresa}`, { 
                    NomeEmp:nomeEmpresa,
                    EmailEmp:emailEmpresa,
                    TelefoneEmp:telefoneEmpresa,
                    Descricao:descricaoEmpresa
                });

            }
          
        }else if(selectedValueEmpresa === "0")
        {
            
            await api.post("/api/clientes", {
                NomeEmp:nomeEmpresa,
                EmailEmp:emailEmpresa,
                TelefoneEmp:telefoneEmpresa,
                Descricao:descricaoEmpresa,
                NUsuarioCriador: NUtilizador 
            }
              
              ).then(clientes => {
                  
                nCliente= clientes.data.message.NCliente;
          
              }).catch(err => {
                  console.log(err);
          
              })

        }else if(isUserDataEditedEmp === true)
        {
            const response = await api.put(`api/clientes/${selectedValueEmpresa}`, { 
                NomeEmp:nomeEmpresa,
                EmailEmp:emailEmpresa,
                TelefoneEmp:telefoneEmpresa,
                Descricao:descricaoEmpresa
            });
        }

        if (adicionarEtiqueta === 0)
        {

            await api.post("/api/etiquetas", { Nome: novaEtiqueta }
              
              ).then(etiqueta => {
                  

                nEtiqueta= etiqueta.data.message.NEtiqueta;
          
              }).catch(err => {
                  console.log(err);
          
              })
        }

        if( adicionarTipoProjeto === 0)
        {
            await api.post("/api/tipoprojetos", { Nome: novoTipoProjeto }
              
              ).then(tipoProjeto => {
                  
                console.log(tipoProjeto);

                nTipoProjeto = tipoProjeto.data.message.NTipoProjeto ;
          
              }).catch(err => {
                  console.log(err);
          
              })

        }
    
        let NnovaEtiqueta=(nEtiqueta) ? nEtiqueta : selectedValueEtiqueta
        let NnovoTipoProjeto=(nTipoProjeto) ? nTipoProjeto : selectedValueTipoProjeto;
        let novoCliente=(nCliente) ? nCliente : selectedValueEmpresa;


        if(isUserDataEditedEmp === false && isUserDataEdited === false && oportunidade.NCliente === NnovaEtiqueta && oportunidade.NEtiqueta === novoCliente && oportunidade.NTipoProjeto === NnovoTipoProjeto)
        {
            showErrorToast("Não foi editado")
            setSubmitting(false);
            return
        }


        api.put(`/api/oportunidades/${oportunidade.NOportunidade}`, {

            Titulo:titulo,
            Valor:valor,
            Descricao:mensagem,
            NEtiqueta:NnovaEtiqueta,
            NTipoProjeto : NnovoTipoProjeto,
            NCliente: novoCliente,
            NUsuario: NUtilizador
         }
          
          ).then(opotunidade => {
              
            showSuccessToast("Enviado com sucesso")
            atulizarOportunidade();
            setSubmitting(false);
            onHide();
        }).catch(err => {
            console.log(err);
            showErrorToast(err.response.data.message)
            setSubmitting(false);
        })
    }
    
    console.log();

    return (  
    <>
    <Modal show={show} onHide={onHide} size="xl">
        <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
            <Modal.Title>Editar Oportunidade</Modal.Title>
            </Modal.Header>

            <Modal.Body> 
                <div className="d-flex m-5 row">
                    <div className="float-start col-md-5">
                    <div className='form-group'>
                        <select value={selectedValueEmpresa} className="form-select"  onChange={handleChangeEmpresa}>
                        <option value="">Escolha uma empresa. Se não existir, crie</option>
                        {optionsEmpresa.map((option) => (
                        <option key={option.NCliente} value={option.NCliente}>
                            {option.NomeEmp}
                        </option>
                        ))}
                        </select>
                    </div> 
                    <br />
                    <label htmlFor="name">Nome Empresa:</label><br />
                    <input type="text" id="name" className='form-control' value={nomeEmpresa} name="name" onChange={(event) =>{setNomeEmpresa(event.target.value);setIsUserDataEditedEmp(true)}} required /><br />
                    <label htmlFor="email">Email Empresa:</label><br />
                    <input type="text" className='form-control' value={emailEmpresa} name="email" onChange={(event) =>{setEmailEmpresa(event.target.value);setIsUserDataEditedEmp(true)}} required/><br />
                
                    <br />
                    <label htmlFor="phone">Telefone Empresa:</label><br />
                    <input type="text" className='form-control' value={telefoneEmpresa} onChange={(event) => {setTelefoneEmpresa(event.target.value);setIsUserDataEditedEmp(true)}} required/><br />
                
                    <br />
                    <label htmlFor="mensagem">Descrição Empresa:</label><br />
                        <textarea type="text" className='form-control' value={descricaoEmpresa} style={{ height: '100px' , width: "100%" }} onChange={(event) => {setDescricaoEmpresa(event.target.value);setIsUserDataEditedEmp(true)}} required/><br />
                    
                    </div>
                    <div className="float-end col-md-6">
                  
                    { (adicionarEtiqueta === 1) ? (
                        <div className='input-group'>
                            <select value={selectedValueEtiqueta} className="form-select"  onChange={(event)=>setSelectedValueEtiqueta(event.target.value)}>
                        <option value="">Área de negócio</option>
                        {optionsEtiquetas.map((option) => (
                        <option key={option.NEtiqueta} value={option.NEtiqueta}>
                            {option.Nome}
                        </option>
                        ))}
                        </select>
                         { (cargo === "0" || cargo === "3") ? (<button type="button" id="adicionar" className="btn btn-upload" onClick={(event)=>setAdicionarEtiqueta(0)} >
                            <Icon.Plus/>
                        </button>
                        ) :(null) }
                        </div> 

                    ) : (
                         
                        <>
                            <label htmlFor="text">Criar Area de negócio:</label><br />
                            <div className='input-group'>
                                <input type="text" className='form-control' value={novaEtiqueta} onChange={(event) =>setNovaEtiqueta(event.target.value)}/><br />
                                <button type="button" id="adicionar" className="btn btn-upload" onClick={(event)=>setAdicionarEtiqueta(1)} >
                                <Icon.XCircle/>
                                </button>
                            </div>
                        </>
                        
                    )}
                    <br />   
                    <br />

                    { (adicionarTipoProjeto === 1) ? (
                        <div className='input-group'>
                            <select value={selectedValueTipoProjeto} className="form-select"  onChange={(event)=>setSelectedValueTipoProjeto(event.target.value)}>
                        <option value="">Tipo de Projeto</option>
                        {optionsTipoProjetos.map((option) => (
                        <option key={option.NTipoProjeto} value={option.NTipoProjeto}>
                            {option.Nome}
                        </option>
                        ))}
                        </select>
                        { (cargo === "0" || cargo === "3") ? (<button type="button" id="adicionar" className="btn btn-upload" onClick={(event)=>setAdicionaTipoProjeto(0)} >
                            <Icon.Plus/>
                        </button>
                        ) :(null) }
                        </div> 

                    ) : (
                         
                        <>
                            <label htmlFor="text">Criar Tipo de Projeto:</label><br />
                            <div className='input-group'>
                                <input type="text" className='form-control' value={novoTipoProjeto} onChange={(event) =>setNovoTipoProjeto(event.target.value)}/><br />
                                <button type="button" id="adicionar" className="btn btn-upload" onClick={(event)=>setAdicionaTipoProjeto(1)} >
                                <Icon.XCircle/>
                                </button>
                            </div>
                        </>
                        
                    )}
                        
                    <br />
                        <label htmlFor="Titulo">Título:</label><br />
                        <input type="text" className='form-control' value={titulo} onChange={(event)=>{setTitulo(event.target.value);setIsUserDataEdited(true)}} /><br />
                        <label htmlFor="pretensao">Valor:</label><br />
                        <input type="text" className='form-control' value={valor} onChange={(event)=>{setValor(event.target.value);setIsUserDataEdited(true)}}/><br />
                        <label htmlFor="mensagem">Descrição:</label><br />
                        <textarea type="text" className='form-control' value={mensagem} style={{ height: '200px' , width: "100%" }} onChange={(event) => setMensagem(event.target.value)} required/><br />
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : <> Submeter <Icon.SendFill/></>}
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
  
  export default ModalOportunidade;
