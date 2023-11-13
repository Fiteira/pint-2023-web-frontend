import './style.css'
import api from '../../services/api';
import { useState, useEffect,useRef } from 'react';
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { useToast } from "../../components/toasts/toast";
function CriarVaga( ) {


    const [optionsLocalidade, setOptionsLocalidade] = useState([]);
    const [optionsTipoVaga, setOptionsTipoVaga] = useState([]);
    const [selectedValueLocalidade, setSelectedValueLocalidade] = useState('Escolha a Localidade');
    const [selectedValueTipoVaga, setSelectedValueTipoVaga] = useState('Escolha a Tipo Vaga');
    const {showErrorToast, showSuccessToast} = useToast();  
    const [submitting, setSubmitting] = useState(false);

    const nomeVaga = useRef('');
    const subtitulo = useRef('');
    const descricao = useRef('');

    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
          const response = await api.get('/api/localidades');
          const data = response.data.message;
          setOptionsLocalidade(data);
        }
        fetchData();
      }, []);

      function handleChangeLocalidade(event) {
        setSelectedValueLocalidade(event.target.value);
      }

      
    useEffect(() => {
        async function fetchData() {
          const response = await api.get('/api/tipovagas');
          const data = response.data.message;
          setOptionsTipoVaga(data);
        }
        fetchData();
      }, []);

      function handleChangeTipoVaga(event) {
        setSelectedValueTipoVaga(event.target.value);
      }

      const CriarVaga = ( (event)=>{
        event.preventDefault();
        
        if (submitting) {
            return;
        }
        setSubmitting(true);

        const nomeVagaValue = nomeVaga.current.value;
        const subtituloValue = subtitulo.current.value;
        const descricaoValue = descricao.current.value;
        
        if(!nomeVagaValue || !subtituloValue || !descricaoValue || !selectedValueLocalidade || !selectedValueTipoVaga)
        {
            showErrorToast("Falta campos por preencher!")
            setSubmitting(false);
            return;
        }

        api.post("/api/vagas" ,{
            NomeVaga:nomeVagaValue,
            Subtitulo:subtituloValue,
            Descricao:descricaoValue,
            NLocalidade:selectedValueLocalidade,
            NTipoVaga:selectedValueTipoVaga})
            .then(vaga => {
                  showSuccessToast("Guardado com sucesso")
                  history.push("/vagas");
                  setSubmitting(false);
            }).catch(err => {
                console.log(err);
                showErrorToast(err.response.data.message);
                setSubmitting(false);
          })

      })


    return(
        <div className="container mt-6">
            <div className="row mb-4">
                <div className="col-md-2 ms-5"><h1>Criar Vaga </h1></div>
            </div>
            
            <div className="card mx-5 p-3"> 
            <div className="row">
                <div className="col-4">
                    <div className="form-floating">
                        <textarea className="form-control mb-3"  ref={nomeVaga} style={{height: '100px'}} required/>
                        <label htmlFor="floatingTextarea2">Nome Vaga</label>
                    </div>
                    <div className="form-floating">
                        <textarea className="form-control" ref={subtitulo}  style={{height: '100px'}} required/>
                        <label htmlFor="floatingTextarea2">Subtítulo</label>
                    </div>
                    <div className="card-body">
                        <div className='form-group'>
                            <select value={selectedValueLocalidade} className="form-select mb-3"  onChange={handleChangeLocalidade} required>
                            <option value="">Escolha a Localidade</option>
                            {optionsLocalidade.map((option) => (
                            <option key={option.NLocalidade} value={option.NLocalidade}>
                                {option.Localidade}
                            </option>
                            ))}
                            </select>
                        </div> 
                        <div className='form-group'>
                            <select value={selectedValueTipoVaga} className="form-select mb-3"  onChange={handleChangeTipoVaga} required>
                            <option value="">Tipo Vaga</option>
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
                            <textarea className="form-control" ref={descricao} style={{height: '340px'}} />
                            <label htmlFor="descricao">Descrição</label>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={CriarVaga}
                        disabled={submitting}
                        >
                        {submitting ? "Enviando..." : <>Criar <Icon.SendFill/></>}
                        </button>
                </div>
            </div>
        </div>
    </div>
    )
}

export { CriarVaga }; 