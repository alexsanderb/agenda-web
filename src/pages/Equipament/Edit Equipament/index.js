import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormEquipament from '../../../components/Form Equipament';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';

function EditEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    const [equipaments, setEquipaments] = useState([]);
    const [equipament, setEquipament] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveEquipaments() {
            setIsLoading(true);
            await api.get("/equipaments")
            .then(function (response) {
                const equipamentsReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setEquipaments(equipamentsReceived);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
            setIsLoading(false);
        }

        async function verify() {
            setIsLoading(true);
            const response = await api.get("/userLogged");
            setIsLoading(false);
            if(response.data.user.function !== 'adm') {
                props.history.push("/schedule/new");
            }
            else{
                return true;
            }
        }
        setShow(verify());
        retrieveEquipaments();
    }, [edit]);

    async function editEquipaments(id, data) {
        setIsLoading(true);
        await api.put(`/equipaments/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function defineEdit(equipament) {        
        setEquipament(equipament);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
    }
      
    return (
        <div>
            {    
                (show) ?  
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            (edit) ?
                                (
                                    <>
                                        <FormEquipament onSubmit={editEquipaments} equipament={equipament}></FormEquipament>
                                        <div className="d-flex flex-row align-items justify-content-center">
                                            <button onClick={returnToTable} className="btn btn-primary btnColor tam">
                                                Voltar
                                            </button>
                                        </div>
                                    </>
                                ) 
                                : 
                                (
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Marca</th>
                                                <th scope="col">Número de patrimônio</th>
                                                <th scope="col">Ações</th>
                                            </tr>
                                        </thead>
                                        {(isLoading) ? 
                                            (
                                                <tbody>
                                                    <tr className="loading">
                                                        <Bounce color="#727981" size={40} speed={1} animating={isLoading} />
                                                    </tr>
                                                </tbody>
                                            ) : 
                                            (
                                                <tbody>
                                                    {equipaments.map(equipament => (
                                                        <tr key={equipament.id}>
                                                            <td>{equipament.name}</td>
                                                            <td>{equipament.brand}</td>
                                                            <td>{equipament.equityNumber}</td>
                                                            <td>
                                                                <button onClick={() => defineEdit(equipament)} className="btn btn-primary btnColor">
                                                                    Editar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))} 
                                                    
                                                </tbody>
                                            )
                                        }
                                    </table>
                                )
                        }
                        
                    </div>
                </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(EditEquipament);