import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';

function DeleteCampus(props) {
    const MySwal = withReactContent(Swal);
    
    const [campuses, setCampuses] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrieveCampuses() {
            setIsLoading(true);
            await api.get("/campuses")
            .then(function (response) {
                const campusesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setCampuses(campusesReceived);
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
        retrieveCampuses();
    }, [deleted]);

    async function deleteCampus(id) {
        setIsLoading(true);
        await api.delete(`/campuses/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Campus deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmDelete(campus) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Não há como desfazer essa ação!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, exclua!'
          }).then((result) => {
            if (result.value) {
                deleteCampus(campus.id);
                setDeleted(false);
            }
        });     
    }
      
    return (
        <div>
            {     
                (show) ? 
                (
                <>
                    <Index></Index>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <div className="container-index">
                            {
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">Cidade</th>
                                            <th scope="col">Endereço</th>
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
                                                {campuses.map(campus => (
                                                    <tr key={campus.id}>
                                                        <td>{campus.city}</td>
                                                        <td>{campus.adress}</td>
                                                        <td><button onClick={() => confirmDelete(campus)} className="btn btn-danger btnColor">
                                                                Excluir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))} 
                                                
                                            </tbody>
                                        )
                                    }
                                </table>
                            }
                            
                        </div>
                    </div>
                </>
                ) : (<Index></Index>) 
                
            }
        </div>
    );
}

export default withRouter(DeleteCampus);