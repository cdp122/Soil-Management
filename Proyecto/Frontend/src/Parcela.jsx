function Parcela({ parcelName }){
    return (
        <div className="sueloscrud-parcel">
            <div className="sueloscrud-parcel-image"></div>
            <label className="sueloscrud-parcel-label">
                <input type="checkbox" /> {parcelName}
            </label>
        </div>
    );
}

export default Parcela;