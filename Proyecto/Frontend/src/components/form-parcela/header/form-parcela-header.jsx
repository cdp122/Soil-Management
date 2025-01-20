import ButtonClose from '../../form/button-close';
import styles from './form-parcela-header.module.css'

const FormParcelaHeader = () =>{
    const headerContainerStyle = styles['header-container'];
    const titleStyle = styles['title'];
    
    return(
        <div className={headerContainerStyle}>
            <div>
                <span className={titleStyle}>Creacion de nueva parcela</span>
                <ButtonClose/>
            </div>
            <div>
            </div>
        </div>
    );
}

export default FormParcelaHeader;