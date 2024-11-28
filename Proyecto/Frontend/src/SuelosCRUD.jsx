import React, { useState } from 'react';
import plus from './assets/plus.svg';
import info from './assets/info.svg';
import edit from './assets/edit.svg';
import del from './assets/delete.svg';
import ModalAdd from './ModalAdd';
import ModalEdit from './ModalEdit';
import ModalAnalysis from './ModalAnalysis';
import './styles/SuelosCRUD.css';

function SuelosCRUD() {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [selectedParcelaId, setSelectedParcelaId] = useState(null);
    const [editingParcela, setEditingParcela] = useState(null);
    const [tableData, setTableData] = useState([]);

    const [previousAnalyses, setPreviousAnalyses] = useState([
        { ph: '6.5', materiaOrganica: '3%', nitrogeno: '0.1%', fosforo: '10 ppm', potasio: '50 ppm', salinidad: '0.2 dS/m' },
    ]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openEditModal = (parcelaId) => {
        const parcelaToEdit = tableData.find(data => data.id === parcelaId);
        setEditingParcela(parcelaToEdit);
        setSelectedParcelaId(parcelaId);  
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const saveDataToTable = (formData) => {
        setTableData(prevData => [...prevData, formData]);
    };

    const saveEditData = (formData, parcelaId) => {
        const updatedData = tableData.map(data =>
            data.id === parcelaId ? { ...data, ...formData } : data
        );
        setTableData(updatedData);
        closeEditModal();
    };

    const openAnalysisModal = (parcelaId) => {
        setSelectedParcelaId(parcelaId);
        setIsAnalysisModalOpen(true);
    };

    const closeAnalysisModal = () => {
        setIsAnalysisModalOpen(false);
    };

    const saveAnalysisData = (formData, parcelaId) => {
        console.log('Datos del análisis guardados para parcela:', parcelaId, formData);
        closeAnalysisModal();
    };

    const deleteParcela = (parcelaId) => {
        const updatedTableData = tableData.filter(data => data.id !== parcelaId);
        setTableData(updatedTableData);
    };

    return (
        <>
            <ModalAdd isOpen={isModalOpen} onClose={closeModal} onSave={saveDataToTable} />

            <ModalEdit 
                isOpen={isEditModalOpen} 
                onClose={closeEditModal} 
                parcelaId={selectedParcelaId} 
                parcelaData={editingParcela}
                onSave={saveEditData} 
            />

            <ModalAnalysis 
                isOpen={isAnalysisModalOpen} 
                onClose={closeAnalysisModal} 
                parcelaId={selectedParcelaId} 
                onSave={saveAnalysisData}
                previousAnalyses={previousAnalyses}
            />

            <div className="sc-up-container">
                <button className='sc-add-soil' onClick={openModal}>
                    <img src={plus} alt="plus-icon" />
                    Añadir Parcela
                </button>
                <input type="text" className='sc-search-soil' />
            </div>

            <div className='sc-info-container'>
                <table className='sc-table-content'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Coordenadas</th>
                            <th>Tamaño</th>
                            <th>Tipo de Suelo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.id}</td>
                                <td>{data.nombre}</td>
                                <td>{data.coordenadas}</td>
                                <td>{data.tamaño}</td>
                                <td>{data.tipoSuelo}</td>
                                <td>
                                    <ul className='sc-actions'>
                                        <li><img src={info} alt="info-icon" onClick={() => openAnalysisModal(data.id)} /></li>
                                        <li><img src={edit} alt="edit-icon" onClick={() => openEditModal(data.id)} /></li>
                                        <li><img src={del} alt="del-icon" onClick={() => deleteParcela(data.id)} /></li>
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default SuelosCRUD;
