import './style.css'
import api from '../../services/api';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { format, subYears } from "date-fns";
import { useToast } from '../../components/toasts/toast';



  function CriarUsuario() {
  
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState('');
    const [data, setData] = useState('');
    const [cargo, setCargo] = useState('');
    const history = useHistory();  
    const { showSuccessToast, showErrorToast} = useToast();
    const minDate = subYears(new Date(), 120);
    const maxDate = new Date();

    const [submitting, setSubmitting] = useState(false);

    async function MandarUsuario({ Nome, Email, Genero, DataNascimento, NCargo }) {
    
    if (!Nome || !Email || !Genero || !DataNascimento || !NCargo) {
      showErrorToast("Preencha os campos!")
      setSubmitting(false);
      return;
    }
    try {
      await api.post("/api/adminregister", { Nome, Email, Genero, DataNascimento, NCargo });  
      showSuccessToast("Utilizador criado com Sucesso!")
      history.push('/utilizadores');
      setSubmitting(false);
    } catch (err) {
      showErrorToast(err.response.data.message)
      setSubmitting(false);
    }
  }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) {
          return;
        }
    
        setSubmitting(true);

        const dataFormatada = format(new Date(data), 'yyyy/MM/dd');
    
        await MandarUsuario({ Nome: name, Email: email, Genero: genero, DataNascimento: dataFormatada, NCargo: cargo });
        
      };
    
  
    function handleDataChange(date) {
      setData(date);
    }
    
  
    return (
      <div className='container mt-6'>
        <div className='row justify-content-center m-auto'>
          <div className='col-md-6'>
            <h1 className='text-center my-5'>Registar novo Utilizador</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label htmlFor='name' className='text-left '>Nome *</label>
                <input type='text' className='form-control' id='name' placeholder='Digite o nome' value={name} onChange={(event) => setName(event.target.value)} required/>
              </div>
              <div className='form-group mb-3'>
                <label htmlFor='email'>Email *</label>
                <input type='email' className='form-control' id='email' placeholder='Digite o email' value={email} onChange={(event) => setEmail(event.target.value)} required/>
              </div>
              <div className='form-group mb-3'>
              <label htmlFor='genero'>Género *</label>
                <select  value={genero} className="form-select mb-3" aria-label="Default select example" onChange={(event) => setGenero(event.target.value)} required>
                  <option value="">Escolha o género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className='form-group mb-3'>
              <label htmlFor="cargo" className="float-right">Cargo:</label>
              <select className="form-select" value={cargo} id="linkedin" onChange={(event) => setCargo(event.target.value)}>
                <option value="0">Administrador</option>
                <option value="1">Utilizador Externo</option>
                <option value="2">Utilizador Interno</option>
                <option value="3">Gestor de Vendas</option>
                <option value="4">Gestor de Ideias</option>
                <option value="5">Recursos Humanos</option>
            </select>
              </div>
              <div className='form-group mb-3'>
                <label htmlFor="data">Data de Nascimento:</label>
                <DatePicker className="w-100" selected={data} onChange={handleDataChange} minDate={minDate} maxDate={maxDate} yearDropdownItemNumber={100} scrollableYearDropdown showYearDropdown id="data" required />
              </div>
              <button type='submit' className='btn btn-primary btn-block mb-3 w-100' disabled={submitting}>
              {submitting ? "Enviando..." : <>Registar</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
export { CriarUsuario }; 