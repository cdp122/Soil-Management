import React, { useState } from 'react';
import ModalInfoP from './ModalInfoP';
import aluvial from './assets/tipos_suelos/aluvial.jpeg';
import arcilloso from './assets/tipos_suelos/arcilloso.jpg';
import arenoso from './assets/tipos_suelos/arenoso.jpg';
import calcareo from './assets/tipos_suelos/calcareo.jpeg';
import franco from './assets/tipos_suelos/franco.jpeg';
import limoso from './assets/tipos_suelos/limoso.jpeg';
import organico from './assets/tipos_suelos/organico.jpeg';
import pedregoso from './assets/tipos_suelos/pedregoso.jpg';
import salino from './assets/tipos_suelos/salino.jpeg';
import volcanico from './assets/tipos_suelos/volcanico.jpeg';

const soilImages = {
    T001: arenoso,
    T002: arcilloso,
    T003: limoso,
    T004: franco,
    T005: calcareo,
    T006: salino,
    T007: organico,
    T008: pedregoso,
    T009: volcanico,
    T010: aluvial,
};

function Parcela({ parcelID, parcelName, parcelType }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const soilImage = soilImages[parcelType] || test;

    return (
        <div className="sueloscrud-parcel">
            <div className="sueloscrud-parcel-image">
                <img src={soilImage} alt={parcelType} onClick={handleImageClick} />
            </div>
            <label className="sueloscrud-parcel-label">
                <input type="checkbox" /> {parcelName}
            </label>
            {isModalOpen && (
                <ModalInfoP isOpen={isModalOpen} onClose={handleCloseModal} parcelID={parcelID} />
            )}
        </div>
    );
}

export default Parcela;