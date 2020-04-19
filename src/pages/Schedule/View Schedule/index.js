import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import './index.css';
import Swal from 'sweetalert2'
import dateFnsFormat from 'date-fns/format';
import { parseDate } from '../../../utils/parseDate';
import { formatDate } from '../../../utils/formatDate';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import withReactContent from 'sweetalert2-react-content';

import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';

function ViewUser(props) {
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    const FORMATVIEW = 'dd/MM/yyyy';
    
    const [date, setDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [period, setPeriod] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveSchedules() {
            setIsLoading(true);
            await api.get("/filter", {
                headers: { 
                    period: '',
                    date_a: dateFnsFormat(new Date(), FORMAT), 
                },
            })
            .then(function (response) {
                setSchedules(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
            setIsLoading(false);
        }

        retrieveSchedules();
        setPeriods([{ period: "Manhã"}, { period: "Tarde"}, { period: "Noite"}]);
    }, []);

    async function filter() {
        if(date && period) {
            setIsLoading(true);
            if(period.period === "Manhã") {
                period.period = "Manha";
            }
            await api.get("/filter", {
                headers: { 
                    period: period.period,
                    date_a: dateFnsFormat(date, FORMAT), 
                },
            })
            .then(function (response) {
                setSchedules(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar filtrar as informações, tente novamente!', 'error');
            });
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
    
    function returnDateFormatted(date) {
        const string = date.toString();
        const dateString = string.split("T");
        return formatDateString(dateString[0]);
    }

    function formatDateString (string) {
        const input = string.split("-");  // ex input "2010-01-18"
        return input[2]+ "/" +input[1]+ "/" +input[0]; 
    }
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        <div className="filtrar">
                            <p className="m-0">Filtrar</p>
                            <div className="filtro">
                                <div className="w-date">
                                    <DayPickerInput
                                        onDayChange={setDate}
                                        className="date-input tam"
                                        formatDate={formatDate}
                                        format={FORMATVIEW}
                                        parseDate={parseDate}
                                        value={date}
                                    />
                                </div>
                                
                                <Combobox 
                                    textField='period' 
                                    data={periods} 
                                    onChange={setPeriod}
                                    value={period}
                                    placeholder="Turno" 
                                    className="tam mr" 
                                />
                                
                                <button onClick={filter} className="btFiltrar">
                                    Filtrar
                                </button>
                            </div>
                        </div>

                        <table className="table table-bordered table-hover mt-3">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Data</th>
                                    <th scope="col">Início</th>
                                    <th scope="col">Término</th>
                                    <th scope="col">Solicitante</th>
                                    <th scope="col">Cadastrador</th>
                                    <th scope="col">Sala</th>
                                    <th scope="col">Equipamentos</th>
                                    <th scope="col">Ano</th>
                                    <th scope="col">Curso</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Observações</th>
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
                                        {schedules.map(schedule => (
                                            <tr key={schedule.id}>
                                                <td>{returnDateFormatted(schedule.date)}</td>
                                                <td>{schedule.initial}</td>
                                                <td>{schedule.final}</td>
                                                <td>{schedule.requesting_user.fullname}</td>
                                                <td>{schedule.registration_user.fullname}</td>
                                                <td>{schedule.place.name}</td>
                                                <td className="d-flex flex-column">
                                                    {schedule.equipaments.map(equipament => (
                                                        <p>{equipament.name}</p>
                                                        
                                                    ))
                                                    }
                                                </td>
                                                <td>{schedule.category.description}</td>
                                                <td>{schedule.course.name}</td>
                                                <td>{
                                                    <p className={
                                                        (schedule.status === 'Cancelado') ?
                                                        "red"
                                                        : 
                                                        ""
                                                    }>{schedule.status}</p>
                                                                                            
                                                    }</td>
                                                <td>{schedule.comments}</td>
                                            </tr>
                                        ))} 
                                        
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(ViewUser);