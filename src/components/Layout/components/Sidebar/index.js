import images from '~/assets/images';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClipboardList, faGauge, faUserGear, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser, faSquare, faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import links from './Links';
import Cookies from 'js-cookie';

var cx = classNames.bind(styles);

function Sidebar() {



    function handleLogout() {
        Cookies.remove('username');
        Cookies.remove('role');
        Cookies.remove('fullname');
        Cookies.remove('avatar');
        // xóa tất cả Cookies khác ở đây nếu có

        window.location.href = '/';
    }

    return (
        <div className={cx('sidebar')}>
            <div className={cx('logo')}>
                <img className={cx('logo-img')} src={images.logo} alt="" />
            </div>
            <div className={cx('navi')}>
                <ul className={cx('list')}>
                    {links.map((item, index) => (
                        <NavLink key={index} className={cx('anchor')} to={item.path}>
                            <FontAwesomeIcon className={cx('item-icon')} icon={item.icon} />
                            {<span>{item.name}</span>}
                        </NavLink>
                    ))}
                </ul>
                <button className={cx('logout-btn')} onClick={handleLogout}>
                    <FontAwesomeIcon className={cx('item-icon')} icon={faSignOutAlt} />
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
