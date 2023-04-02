import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import classNames from 'classnames/bind';
import styles from './CustomButton.module.scss';
var cx = classNames.bind(styles);

const Button = styled.button`
color: ${props => props.color || 'gray'};
`;


function CustomButton(props) {
  const { color, icon, children, ...rest } = props;

  return (
    <Button className={cx('button')} color={color} {...rest}>
      {icon && <FontAwesomeIcon className={cx('icon')} icon={icon} fontSize={24}/>}
      {children}
    </Button>
  );
}

export default CustomButton;