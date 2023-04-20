import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
var cx = classNames.bind(styles);

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                '/AppFood/dangnhap.php',
                { username, password },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            .then((response) => {
                const data = response.data;
                const { username, role, fullname, avatar } = data.result[0]; 
                console.log(data);
                if (data.success && role === 'admin') { 
                    setMessage('Đăng nhập thành công!');
                    toast.success(message);
                    Cookies.set('username', username);
                    Cookies.set('role', role);
                    Cookies.set('fullname', fullname); 
                    Cookies.set('avatar', avatar)
                    // // Lưu thông tin đăng nhập vào cookie
                    navigate('/dashboard'); // Chuyển hướng đến trang dashboard
                } else {
                    setMessage('Đăng nhập không thành công!');
                    toast.error(message);
                }
            })
            .catch((error) => {
                console.error(error);
                setMessage('Đã xảy ra lỗi khi đăng nhập!');
            });
    };

    // Kiểm tra cookie khi component được render
    useEffect(() => {
        const username = Cookies.get('username');
        if (username) {
            navigate('/dashboard'); // Chuyển hướng đến trang dashboard nếu đã đăng nhập
        }
    }, [navigate]);

    return (
        <div className={cx('form')}>
            <ToastContainer />
            <h1>Đăng nhập</h1>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-item')}>
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username} 
                        placeholder='Nhập username ...'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={cx('form-item')}>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        name="password" 
                        placeholder='Nhập password ...' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button className={cx('form-login-btn')} type="submit">
                        Đăng nhập
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
