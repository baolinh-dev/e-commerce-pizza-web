import Sidebar from '~/components/Layout/components/Sidebar';   
import styles from './DefaultLayout.module.scss'
import classNames from 'classnames/bind'; 
var cx = classNames.bind(styles); 

function DefaultLayout({ children }) {
    return ( 
        <div className={cx('container')}>
            <Sidebar />
            <div className={cx('wrapper')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
