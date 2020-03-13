import 'bootstrap/dist/css/bootstrap.css';

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

function NewEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [equityNumber, setEquityNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function save() {
        if(name && brand && equityNumber) {
            const userLogged = await api.get('/userLogged');
            setIsLoading(true);
            await api.post("/equipaments", {
                    name,
                    brand,
                    equityNumber,
                    status: 'Ativo',
                    campus_id: userLogged.data.campus.id,
            })
            .then(function (response) {
                console.log(response.data);
                MySwal.fire('Prontinho', 'Equipamento cadastrado com sucesso!', 'success');
                setName('');
                setBrand('');
                setEquityNumber('');
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
            });
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column pb-2 pt-5 ">
                            <input type="text" 
                                   className="tam form-control" 
                                   placeholder="Nome"
                                   value={name}
                                   onChange={e => setName(e.target.value)}
                            ></input>
                            <input type="text" 
                                   className="tam form-control mt-2" 
                                   placeholder="Marca"
                                   value={brand}
                                   onChange={e => setBrand(e.target.value)}
                            ></input>
                            <input type="text" 
                                   className="tam form-control mt-2" 
                                   placeholder="Número de patrimônio"
                                   value={equityNumber}
                                   onChange={e => setEquityNumber(e.target.value)}
                            ></input>
                            <button 
                                onClick={save} 
                                className="btn btn-primary btnColor tam mt-3"
                                >
                                    Salvar
                                    <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                            </button>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewEquipament);