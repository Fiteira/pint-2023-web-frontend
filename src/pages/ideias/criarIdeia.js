import './style.css'
import api from '../../services/api';
import { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../components/toasts/toast';
import * as Icon from 'react-bootstrap-icons';
function CriarIdeia( ) {
    const id = localStorage.getItem("IDUtilizador");
    
    const Titulo = useRef('');
    const descricao = useRef('');
    const [topicos, setTopicos] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { showSuccessToast, showErrorToast, showMessageToast } = useToast();

    const [submitting, setSubmitting] = useState(false);

    const history = useHistory();

    useEffect(() => {
        async function fetchTopicos() {
          const response = await api.get("/api/topicoideias");
          setTopicos(response.data.message);
        }
        fetchTopicos();
      }, []);


      const enviartopicos = async (dataArray, nideia) => {
        try {
          const postRequests = dataArray.map(async (data) => {
            await api.post("/api/topicosdasideias", {NTopicoIdeia:data, NIdeia:nideia});
          });
      
          await Promise.all(postRequests);
          
            showSuccessToast("Enviado com sucesso!")
            history.push("/");


        } catch (error) {
          console.error('Error occurred during requests:', error);
        }
      };
      
      const CriarIdeia = (event) => {
        event.preventDefault();
        
        if (submitting) {
          return;
        }
    
        setSubmitting(true);

        const tituloValue = Titulo.current.value;
        const descricaoValue = descricao.current.value;

        if (!tituloValue || !descricaoValue || !selectedOptions.length) {
          showErrorToast("É necessário preencher todos os campos!")
          return;
        }

        api.post("/api/ideias" ,{
            Titulo:tituloValue,
            Descricao:descricaoValue,
            NUsuario:id,
            Estado:"Pendente",
        })
        .then(response => {
            enviartopicos(selectedOptions, response.data.message.NIdeia)
            setSubmitting(false);
        })
        .catch(err => {
            console.log(err);
            setSubmitting(false);
        });
    }

    const handleOptionClick = (optionValue) => {
      setSelectedOptions((prevSelected) => {
        if (prevSelected.includes(optionValue)) {
          return prevSelected.filter((selectedOption) => selectedOption !== optionValue);
        } else {
          return [...prevSelected, optionValue];
        }
      });
    };


    return(
        <div className="container mt-6 text-start ">

            <div className="row mb-2">
              <div className="col-md-5"><h1>Propor ideia </h1></div>
            </div>

            <div className="row">
              <div className="col-md-7 mb-3 text-start mb-5"> 
                Pois acreditamos que as vossas ideias são importantes para a evolução da nossa empresa.
              </div>
              <div className="col-md-6"/> 
            </div>
            <div className="card p-3">
            <div className="row">
                <div className="col-md-4">
                  <div className="form-floating">
                      <textarea className="form-control"  ref={Titulo} style={{height: '100px'}} required />
                      <label htmlFor="floatingTextarea2">Título da ideia:</label>
                  </div>
                  <br/>
                  <div className="select-container" style={{height: '200px'}}>
                  <div className="accordion" id="usersAccordion">
                    <div className="accordion-item">
                      <h5 className="accordion-header" id="usersHeading">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#usersCollapse" aria-expanded="true" aria-controls="usersCollapse">
                          Escolha os tópicos:
                        </button>
                      </h5>
                      <div id="usersCollapse" className="accordion-collapse collapse show" aria-labelledby="usersHeading" data-bs-parent="#usersAccordion">
                        <div className="accordion-body" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          <ul className="list-group">
                            {topicos.map((topico) => (
                              <li
                                className={`list-group-item ${selectedOptions.includes(topico.NTopicoIdeia) ? 'active' : ''}`}
                                key={topico.NTopicoIdeia}
                                onClick={() => handleOptionClick(topico.NTopicoIdeia)}
                              >
                                {topico.NomeTopico}
                              </li>
                            ))}
                          </ul>
                        </div>
                    </div>
                  </div>
                </div>
            </div> 
        </div>
        <div className="col-md-7 text-start">
            <div className="form-floating">
                    <textarea className="form-control" ref={descricao} style={{height: '270px'}} />
                    <label htmlFor="descricao">Detalhes da Ideia:</label>
            </div>
        </div>
        <div className="d-flex justify-content-end">   
                <button type="button" className="btn btn-primary" onClick={CriarIdeia} disabled={submitting}>
                {submitting ? "Enviando..." : <>Submeter Ideia <Icon.SendFill/></>}
                </button>
              </div>
        </div>
  </div>
  </div>
    )
}

export { CriarIdeia }; 




