import styles from './LoginLayout.module.scss'
import classNames from 'classnames/bind';
var cx = classNames.bind(styles);

function LoginLayout({ children }) {
    return (
        <div className={cx('container')}> 
            <div className={cx('content')}>{children}</div>
        </div>
    );
}

export default LoginLayout;
