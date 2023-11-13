import "./style.css";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToast } from "../../components/toasts/toast";
import * as Icon from 'react-bootstrap-icons';
function EditarVaga() {


  const [optionsLocalidade, setOptionsLocalidade] = useState([]);
  const [optionsTipoVaga, setOptionsTipoVaga] = useState([]);
  const [selectedValueLocalidade, setSelectedValueLocalidade] = useState("");
  const [selectedValueTipoVaga, setSelectedValueTipoVaga] = useState("");
  const {showErrorToast, showSuccessToast} = useToast();  
  const { nvaga } = useParams();

  const [nomeVaga, setNomeVaga] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [isUserDataEdited, setIsUserDataEdited] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/api/localidades");
      const data = response.data.message;
      setOptionsLocalidade(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/api/tipovagas");
      const data = response.data.message;
      setOptionsTipoVaga(data);
    }
    fetchData();
  }, []);

  const GuardarVaga = (event) => {
    event.preventDefault();

      if (submitting) {
        return;
    }
    setSubmitting(true);


    if(isUserDataEdited === true){
      api.put(`/api/vagas/${nvaga}`, {  
        NomeVaga: nomeVaga,
        Subtitulo: subtitulo,
        Descricao: descricao,
        NLocalidade: selectedValueLocalidade,
        NTipoVaga: selectedValueTipoVaga,
      })
      .then(() => {
        setIsUserDataEdited(false)
        setSubmitting(false);
          showSuccessToast("Guardado com sucesso")
          history.push("/vagas");

      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        showErrorToast(err.response.data.message)
      });
    }else{
      setSubmitting(false);
        showErrorToast("Não foi alterada a vaga")
        history.push("/vagas");
    }
   
  };



  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/vagas/${nvaga}`);
          setNomeVaga(response.data.message.NomeVaga);
          setSubtitulo(response.data.message.Subtitulo);
          setDescricao(response.data.message.Descricao);
          setSelectedValueLocalidade(response.data.message.NLocalidade)
          setSelectedValueTipoVaga(response.data.message.NTipoVaga)
        
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [nvaga]);

  return (
    <div className="container mt-6">
      <div className="row mb-4">
        <div className="col-md-4 ms-5 text-start"><h1>Editar Vaga </h1></div>
      </div>
        
      <div className="card mx-5 p-3">
        <div className="row">
          <div className="col-4">
              <div className="form-floating">
                <textarea className="form-control mb-3" value={nomeVaga} onChange={(event) => {setNomeVaga(event.target.value);setIsUserDataEdited(true);}} style={{ height: "100px" }}/>
                <label htmlFor="floatingTextarea2">Nome Vaga</label>
              </div>
              <div className="form-floating">
                <textarea className="form-control" value={subtitulo} onChange={(event) => {setSubtitulo(event.target.value);setIsUserDataEdited(true);}} style={{ height: "100px" }}/>
                <label htmlFor="floatingTextarea2">Subtítulo</label>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <select value={selectedValueLocalidade} className="form-select mb-3" onChange={(event) =>{setSelectedValueLocalidade(event.target.value);setIsUserDataEdited(true);}}>
                    {optionsLocalidade.map((option) => (
                      <option key={option.NLocalidade} value={option.NLocalidade}>
                        {option.Localidade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select value={selectedValueTipoVaga} className="form-select mb-3"  onChange={(event) => {setSelectedValueTipoVaga(event.target.value);setIsUserDataEdited(true)}}>
                    {optionsTipoVaga.map((option) => (
                      <option key={option.NTipoVaga} value={option.NTipoVaga}>
                        {option.NomeTipoVaga}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
              <div className="col-7 text-start">
                <div className="form-floating">
                  <textarea className="form-control" value={descricao} onChange={(event) =>{ setDescricao(event.target.value);setIsUserDataEdited(true)}} style={{ height: "340px" }}/>
                  <label htmlFor="descricao">Descrição</label>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={GuardarVaga}
                  disabled={submitting}
                >
                  {submitting ? "Enviando..." : <>Guardar <Icon.Save/></>}
                </button>
              </div>
            
          </div>
       

        </div>     
    
    </div>
  );
}

export { EditarVaga };
