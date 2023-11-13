import * as Icon from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

const Card = ({ vaga ,cargo,AtualizarLista }) => {

  const history = useHistory();
  return (
    <div className="col-lg-5 mb-4" >
      <div className="card card-sombra"> 
        <div className="card-body">
          <div className="row card-title align-items-center">
            <h5 className="col-9 mt-1 d-flex align-items-center text-start">{vaga.NomeVaga}</h5>
            {cargo === 1 || cargo === null  ? ( null
             ) : <span className={`col-3 m-3 badge ${vaga.NTipoVaga === 1 ? 'corExterna' : 'corInterna'} text-wrap text-truncate`} style={{ maxWidth: '5rem' }}>{vaga.TipoVaga}</span>}
         </div>
          <hr className="my-1"/>
          <h6 className="card-subtitle mb-2 text-muted text-start mt-2"><Icon.GeoAltFill/>&nbsp;&nbsp;{vaga.Localidade}</h6>
          
          <h6 className="card-subtitle mb-2 mt-2 text-start">{vaga.Subtitulo}</h6>
          
          <div className="d-flex justify-content-end mt-3">
            <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => history.push(`/vagas/${vaga.NVaga}`)}
                    >
                    Mostrar mais
            </button>&nbsp;
            {cargo === 0 || cargo === 5 ? (
                    <button
                    type="button"
                    className="btn btn-secondary mx-2"
                    onClick={() => history.push(`/vagaseditar/${vaga.NVaga}`)}
                    >
                    Editar <Icon.PencilFill/>
                    </button>
                  ) : null}
              &nbsp;
            {cargo === 0 || cargo === 5 ? (
              <div className="d-flex justify-content-center align-items-center">
                  <div className="form-check form-switch align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`flexSwitchCheck${vaga.Estado === 0 ? "Default" : "Checked"}`}
                        checked={vaga.Estado === 0 ? false : true}
                        onChange={async () => {
                          const novoEstado = vaga.Estado === 0 ? 1 : 0;
                          await api.put(`/api/vagas/${vaga.NVaga}`, { Estado: novoEstado }).then(() => {

                            AtualizarLista();
                          });
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheck${vaga.Estado === 0 ? "Default" : "Checked"}`}
                      >
                        {vaga.Estado === 0 ? "Ativar Vaga" : "Desativar Vaga"}
                      </label>
                  </div>
                </div>):null}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Card;