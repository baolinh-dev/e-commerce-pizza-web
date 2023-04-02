import styles from './CardInfor.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faCartShopping, faWallet} from '@fortawesome/free-solid-svg-icons';
var cx = classNames.bind(styles); 

function CardInfor({ quantity, name, icon }) {   
    // faUsers faClipboardList faCartShopping faWallet
    function toggleIcon(icon) {  
        switch(icon) {
            case 'faUsers':
              return faUsers;
            case 'faClipboardList':
              return faClipboardList;
            case 'faCartShopping':
              return faCartShopping;
            case 'faWallet':
              return faWallet;
            default:
              return null;
          }
    }
    return (
        <div className={cx('card-infor')}>
            <div className={cx('card-infor__content')}>
                <h3 className={cx('card-infor__name')}>{name}</h3>
                <p className={cx('card-infor__number')}>{quantity}</p>
            </div>  
            <FontAwesomeIcon className={cx('card__icon')} icon={toggleIcon(icon)}/> 
        </div>
    );
}

export default CardInfor;
