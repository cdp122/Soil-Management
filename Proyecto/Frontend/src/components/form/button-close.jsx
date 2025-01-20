import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'
import styles from './button-close.module.css'


const ButtonClose = () =>{
    const buttonContainerStyle = styles['button-container'];
    const buttonIconStyle = styles['button-icon'];

    return(
        <div className={buttonContainerStyle}>
            <button>
            <FontAwesomeIcon className={buttonIconStyle} icon={faXmark}/>    
            </button>
        </div>
    )
}

export default ButtonClose;