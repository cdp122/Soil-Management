import styles from './input-text.module.css';

const InputNumber = ({name,value, label, placeholder, changeHandler}) => {
    const containerStyle = styles['container'];
    const labelStyle = styles['label'];
    const inputContainerStyle = styles['input-container'];
    const inputStyle = styles['input'];

    return (
        <div className={containerStyle}>
            <div className={labelStyle}>
                <label>{label}</label>
            </div>
            <div className={inputContainerStyle}>
                <input
                    name={name}
                    value={value}
                    className={inputStyle}
                    type="number"
                    min="0"
                    placeholder={placeholder}
                    onChange={changeHandler}
                />
            </div>
        </div>
    );
};

export default InputNumber;
