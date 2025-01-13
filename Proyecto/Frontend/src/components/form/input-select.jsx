import styles from './input-text.module.css';
import styles2 from './input-select.module.css';

const InputSelect = ({label, name, value, options, changeHandler}) => {
    const containerStyle = styles['container'];
    const labelStyle = styles['label'];
    const selectContainerStyle = styles2['select-container'];
    const selectStyle = styles2['select'];

    return (
        <div className={containerStyle}>
            <div className={labelStyle}>
                <label>{label}</label>
            </div>
            <div className={selectContainerStyle}>
                <select className={selectStyle} name={name} value={value} onChange={changeHandler}>
                    {options.map((opcion, index) =>(
                        <option key={index} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default InputSelect;
