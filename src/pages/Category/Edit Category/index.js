import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormCategory from '../../../components/Form Category';

function EditCategory(props) {
    const MySwal = withReactContent(Swal);
    
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrieveCategories() {
            await api.get("/categories")
            .then(function (response) {
                const categoriesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setCategories(categoriesReceived);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        async function verify() {
            const response = await api.get("/userLogged");
            if(response.data.user.function !== 'adm') {
                props.history.push("/schedule/new");
            }
            else{
                return true;
            }
        }
        setShow(verify());
        retrieveCategories();
    }, [edit]);

    async function editCategories(id, data) {
        await api.put(`/categories/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Ano editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
    }

    function defineEdit(category) {
        setCategory(category);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
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
                                (edit) ?
                                    (
                                        <>
                                            <FormCategory onSubmit={editCategories} category={category}></FormCategory>
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
                                                    <th scope="col">Descrição</th>
                                                    <th scope="col">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map(category => (
                                                    <tr key={category.id}>
                                                        <td>{category.description}</td>
                                                        <td>
                                                            <button onClick={() => defineEdit(category)} className="btn btn-primary btnColor">
                                                                Editar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))} 
                                                
                                            </tbody>
                                        </table>
                                    )
                            }
                            
                        </div>
                    </div>
                </>
                )  : (<Index></Index>)
                
            }
        </div>
    );
}

export default withRouter(EditCategory);