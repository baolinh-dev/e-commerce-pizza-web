import images from '~/assets/images';
import { NavLink } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBars, faClipboardList, faGauge, faUserGear, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser, faSquare, faUser } from '@fortawesome/free-regular-svg-icons';
import links from './Links';

var cx = classNames.bind(styles);

function Navigation() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(300);
  
    function handleToggleSidebar() {
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setSidebarWidth(isSidebarCollapsed ? 300 : 120);
    }
  
    return (
      <div className={cx('sidebar')} style={{ width: sidebarWidth }}>
        <div className={cx('logo')}>
          <img className={cx('logo-img')} src={images.logo} alt="" />
        </div>
        <div className={cx('navi')}>
          <ul className={cx('list')}>
            {links.map((item, index) => (
              <NavLink key={index} className={cx('anchor')} to={item.path}>
                <FontAwesomeIcon className={cx('item-icon')} icon={item.icon} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </ul>
        </div>
        <button className={cx('toggle-btn')} onClick={handleToggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    );
  }

export default Navigation;
