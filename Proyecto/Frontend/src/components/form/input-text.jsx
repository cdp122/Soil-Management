import styles from './input-text.module.css';

const InputText = ({name, value, label, placeholder, changeHandler}) => {
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
                    type="text"
                    placeholder={placeholder}
                    onChange={changeHandler}
                />
            </div>
        </div>
    );
};

export default InputText;
