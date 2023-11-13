/* eslint-disable eqeqeq */
import './style.css'; 
import Colunas from "../oportunidade/colunas"
import api from '../../services/api';
import { useState,useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ModalCriarOportunidade from "./modalCriarOportunidade";
import { useToast } from '../../components/toasts/toast';




import * as Icon from 'react-bootstrap-icons';


function Oportunidade() {


  var cargo = localStorage.getItem('Cargo');
  const { showSuccessToast, showErrorToast, showMessageToast } = useToast();
  const NUtilizador = localStorage.getItem('IDUtilizador');
  const [columns, setColumns] = useState([]);
  const [showModalCriarOportunidade, setshowModalCriarOportunidade] = useState(false);
  const [atualizar, setAtualizar] = useState(1);

  const [creatingStage, setCreatingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState('');

  const [selectedValueEtiqueta, setSelectedValueEtiqueta] = useState('');
  const [optionsEtiquetas, setOptionsEtiquetas] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('1');

  useEffect(() => {
    async function fetchDataEtiquetas() {
      const response = await api.get('/api/etiquetas');
      const data = response.data.message;
       setOptionsEtiquetas(data);
    }
    fetchDataEtiquetas();
  }, []);

  const handleCloseModalCriarOportunidade = () => {
    setshowModalCriarOportunidade(false);
    setAtualizar(atualizar + 1);
    
  };
  

  useEffect(() => {

    async function buildInitialData() {
      try {


        let responseOportunidades;

        if (selectedOrder == 1) {
          responseOportunidades = await api.get("/api/oportunidades");
          
        } else {
          responseOportunidades = await api.get("/api/oportunidades?ordem=asc");
        }

        
        let oportunidades;

        if (cargo === "0" || cargo === "3") {
          if (selectedValueEtiqueta) {
            oportunidades = responseOportunidades.data.message.filter((oportunidade) => oportunidade.NEtiqueta == selectedValueEtiqueta);
          } else {
            oportunidades = responseOportunidades.data.message;
          }
        } else {
          if (selectedValueEtiqueta) {
            oportunidades = responseOportunidades.data.message.filter((oportunidade) => oportunidade.NEtiqueta == selectedValueEtiqueta && String(oportunidade.NUsuario) === NUtilizador);
          } else {
            oportunidades = responseOportunidades.data.message.filter((oportunidade) => String(oportunidade.NUsuario) === NUtilizador);
          }
          
        }
  
        const responseEstagios = await api.get("/api/estagios");
        const estagios = responseEstagios.data.message;
  
        const initialColumns = estagios.map((estagio) => ({
          id: estagio.NEstagio,
          title: estagio.Nome,
          cardOrder: [],
          cards: [],
        }));
        
        oportunidades.forEach((oportunidade) => {
          const column = initialColumns.find(
            (column) => column.id === oportunidade.NEstagio
          );
          
          if (column) {
            column.cardOrder.push(oportunidade.idOportunidade);
            column.cards.push({
              idOportunidade: oportunidade.NOportunidade,
              nomeOportunidade: oportunidade.Titulo,
              NomeCliente: oportunidade.NomeCliente,
              Data: oportunidade.DataHoraCriacao,
              Cargo:oportunidade.CargoUsuarioCriador

            });
          }
        });
        
        const board = {
          id: "1",
          columnOrder: estagios.map((estagio) => estagio.NEstagio),
          columns: initialColumns,
        };
        
        await setColumns(board.columns);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchData() {
      await buildInitialData();
    }

    fetchData();

  }, [atualizar,NUtilizador,cargo,selectedValueEtiqueta,selectedOrder]); 



  const onDragEnd = async (result) => {
    const { source, destination } = result;
    // Verifica se o card foi movido para outra coluna
    if (!destination || source.droppableId === destination.droppableId || cargo == 1 || cargo == 2  || cargo == 4  || cargo == 5) {
      return;
    }
      
    // Obtém as informações do card que foi movido
    let originColumn;
    columns.forEach((column) => {
      if (column.id == source.droppableId) {
        originColumn = column;
      }
    });
    
      
    const movedCard = originColumn.cards[source.index];
    const oportunidadeId = movedCard.idOportunidade;
      
    // Obtém o ID do estágio da coluna de destino
      
    const destinationColumn = columns.find((column) => column.id == destination.droppableId);
    const novoEstagioId = destinationColumn.id;
      
    try {
      // Atualiza o NEstagio da oportunidade na API
      await api.put(`/api/oportunidades/${oportunidadeId}`, { NEstagio: novoEstagioId });
      
      // Atualiza o estado dos dados na aplicação
      const newColumns = [...columns];
      const sourceColumnIndex = newColumns.findIndex((column) => column.id == source.droppableId);
      const destinationColumnIndex = newColumns.findIndex((column) => column.id == destination.droppableId);
      
      const [movedCard] = newColumns[sourceColumnIndex].cards.splice(source.index, 1);
      newColumns[destinationColumnIndex].cards.splice(destination.index, 0, movedCard);
      
      
      setColumns(newColumns);
     
      
    } catch (error) {
      console.error(error);
    }
  };


    const AtualizarLista = () => {
      setAtualizar(atualizar + 1);
    };
  

    const handleFormSubmit = (event) =>{
      event.preventDefault();


      if(newStageTitle)
      {
        api.post("/api/estagios", {
          Nome:newStageTitle
        }
        
        ).then(estagio => {
            showSuccessToast("Coluna criada com sucesso!")
         
        }).catch(err => {
            console.log(err);
           
        })
      }
      setNewStageTitle('');
      setCreatingStage(false);
      setAtualizar(atualizar + 1);
    };

    

  return (
    <>
    {!columns || columns.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border mx-auto my-auto" style={{width: '3rem', height: '3rem'}} role="status" />
        </div>
      ) :(

        <div className="container mt-6 ">
        <div className="row">
          <div className="col-md-4 text-start"><h1>Visualizar negócios</h1></div>
          
          <div className="col-md-2 offset-1 d-flex align-items-center justify-content-center">
          <select value={selectedValueEtiqueta} className="form-select"  onChange={(event)=>setSelectedValueEtiqueta(event.target.value)}>
            <option value="">Área de negócio</option>
            {optionsEtiquetas.map((option) => (
            <option key={option.NEtiqueta} value={option.NEtiqueta}>
                {option.Nome}
            </option>
            ))}
          </select>
          </div>
          <div className="col-md-2 d-flex align-items-center justify-content-center">
          <select value={selectedOrder} className="form-select" onChange={(event) => setSelectedOrder(event.target.value)}>
                  <option value="1">Mais recentes</option>
                  <option value="2">Mais antigas</option>
                </select>
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-primary m-2" onClick={(event) =>{setshowModalCriarOportunidade(true)}} >Criar Oportunidade&nbsp;<Icon.PlusLg/></button>
          </div>
        </div>
          <div className="row">
            <div className="col-md-11 ms-4 mb-3 text-start"> 
              {cargo == 1 || cargo == 2 || cargo == 4 || cargo == 5 ? (
                <div class="alert alert-danger" role="alert">
                   Você só pode visualizar suas <strong>próprias</strong> oportunidades de negócio e não tem permissão para alterar seu estado.
               </div>

              ) : (null)}
            </div>
            <div className='ms-3' style={{ display: 'flex' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: 'blue', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
        <span style={{ marginLeft: '5px' }}>Autor Externo</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <span style={{ backgroundColor: 'green', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
        <span style={{ marginLeft: '5px' }}>Autor Interno</span>
      </div>
      </div>
      <br/>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
              <div className="board-columns col-md-12">
                {columns &&
                  columns.length > 0 &&
                  columns.map((column, index) => {
                    return <Colunas 
                            key={column.id} 
                            column={column} 
                            index={index} 
                            AtualizarLista={AtualizarLista}
                            cargo={cargo}
                          />;
                  })} 
                <div className="col">
                {cargo === "0" || cargo === "3" ? (
                  creatingStage ? (
                    <form onSubmit={handleFormSubmit}>
                      <input
                        type="text"
                        className="corDoInput ms-3 mb-2"
                        value={newStageTitle}
                        onChange={(event) => setNewStageTitle(event.target.value)}
                        placeholder="Novo estágio"
                        required
                      />
                      <button type="submit" className="btn btn-primary">Criar <Icon.PlusLg/></button>
                      &nbsp;
                      <button type="button" className="btn btn-primary" onClick={() => setCreatingStage(false)}>Cancelar <Icon.XLg/></button>
                    </form>
                  ) : (
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setCreatingStage(true)}>
                      <Icon.PlusLg />
                    </button>
                  )
                ) : null}
                
                </div> 
              </div>   
          </DragDropContext>
          
        </div>

      )}
     

      <ModalCriarOportunidade
          show={showModalCriarOportunidade}
          onHide={handleCloseModalCriarOportunidade}
          nCargo = {cargo}
        />



    </>
  );
}

export {Oportunidade}
