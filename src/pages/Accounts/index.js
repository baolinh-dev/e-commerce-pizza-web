import CustomButton from '~/components/CustomButton';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './Accounts.module.scss';
var cx = classNames.bind(styles);
function Accounts() {
    // useState
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditSuccess, setIsEditSuccess] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [items, setItems] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [role, setRole] = useState('all');
    const roles = [
        { id: 'all', name: 'Tất cả' },
        { id: 'user', name: 'Người dùng' },
        { id: 'admin', name: 'Quản trị viên' },
    ];
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        avatar: '',
        password: '',
        fullname: '',
        email: '',
        phone: '',
        role: 'user',
    });
    // Register Function
    const handleInputChange = (event) => {
        if (event.target.name === 'avatar') {
            setFormData({
                ...formData,
                avatar: event.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = []; // initialize an empty array to store errors

        // Check for username
        if (!formData.username) {
            errors.push('Vui lòng nhập tên đăng nhập');
        }

        // Check for password
        if (!formData.password) {
            errors.push('Vui lòng nhập mật khẩu ');
        }

        // Check for fullname
        if (!formData.fullname) {
            errors.push('Vui lòng nhập họ và tên');
        }

        // Check for email
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('Vui lòng nhập email hợp lệ');
        }

        // Check for phone
        if (!formData.phone || !/^[0-9]*$/.test(formData.phone)) {
            errors.push('Vui lòng nhập số điện thoại hợp lệ');
        }

        if (!formData.role) {
            errors.push('Vui lòng nhập quyền truy cập');
        }

        // If there are any errors, display them in separate toast messages
        if (errors.length > 0) {
            errors.forEach((error) => {
                toast.error(error, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        } else {
            // If there are no errors, submit the form
            axios
                .post('/AppFood/dangki.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    handleCloseRegisterModal();
                    toast.success('Đăng kí thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Đăng kí thất bại!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    console.log(error.message);
                });
        }
    };

    const handleShowRegisterModal = () => setShowRegisterModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);
    // Get Function
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`/AppFood/user.php`, {
                    params: { page: pageNumber, search: searchKeyword, role },
                });
                setItems(response.data.result);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.log(error);
            }
        };
        fetchItems();
    }, [pageNumber, searchKeyword, isEditSuccess, role]);

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };
    // Delete Function
    const handleDelete = (id) => {
        setDeleteItemId(id);
        setShowDeleteModal(true);
    };
    const handleDeleteConfirm = () => {
        axios
            .delete(`/AppFood/deleteuser.php?id=${deleteItemId}`)
            .then(() => {
                toast.success('Xóa thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // Cập nhật lại danh sách sau khi xóa thành công
                setItems(items.filter((item) => item.id !== deleteItemId));
                setShowDeleteModal(false);
            })
            .catch((error) => {
                toast.error('Xóa thất bại!');
                console.log(error);
            });
    };
    const handleDeleteCancel = () => {
        setDeleteItemId(null);
        setShowDeleteModal(false);
    };
    // Edit Function
    const handleEdit = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };
    //
    const handleFileChange = (event) => {
        const selectedFile = URL.createObjectURL(event.target.files[0]);
        setEditUser((prevEditOrder) => ({
            ...prevEditOrder,
            avatar: selectedFile,
        }));
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username') ?? '';
        const avatar = formData.get('avatar') ?? '';
        const password = formData.get('password') ?? '';
        const fullname = formData.get('fullname') ?? '';
        const email = formData.get('email') ?? '';
        const phone = formData.get('phone') ?? '';
        const role = formData.get('role') ?? '';
        const errors = []; // initialize an empty array to store errors

        console.log('Avatar: ', avatar.name);

        if (editUser && editUser.hasOwnProperty('id')) {
            // Check for username
            if (!username) {
                errors.push('Vui lòng nhập tên đăng nhập');
            }

            // Check for avatar
            if (!avatar || avatar.name === '') {
                errors.push('Vui lòng chọn avatar');
            }

            // Check for password
            if (!password || password.length < 6) {
                errors.push('Vui lòng nhập mật khẩu ít nhất 6 ký tự');
            }

            // Check for fullname
            if (!fullname) {
                errors.push('Vui lòng nhập họ và tên');
            }

            // Check for email
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Vui lòng nhập email hợp lệ');
            }

            if (!phone || !/^[0-9]*$/.test(phone)) {
                errors.push('Vui lòng nhập số điện thoại hợp lệ');
            }

            if (!role) {
                errors.push('Vui lòng nhập quyền truy cập');
            }

            // If there are any errors, display them in separate toast messages
            if (errors.length > 0) {
                errors.forEach((error) => {
                    toast.error(error, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            } else {
                // If there are no errors, submit the form
                axios
                    .post(
                        `/AppFood/updateuser.php?`,
                        {
                            id: editUser.id,
                            username,
                            avatar,
                            password,
                            fullname,
                            email,
                            phone,
                            role,
                        },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            baseURL: 'http://127.0.0.1', // set the base URL to the correct port
                        },
                    )
                    .then((response) => {
                        if (response.data) {
                            toast.success('Đã edit thành công!');
                            // Cập nhật lại danh sách sau khi sửa thành công
                            setItems(
                                items.map((item) =>
                                    item.id === editUser.id
                                        ? { ...item, username, avatar, password, fullname, email, phone, role }
                                        : item,
                                ),
                            );
                            setShowEditModal(false);
                            setEditUser(null);
                            setIsEditSuccess(true);
                        } else {
                            toast.error('Edit thất bại!');
                        }
                    })
                    .catch((error) => {
                        toast.error('Edit thất bại!');
                        console.log(error);
                    });
            }
        } else {
            console.log('Không tìm thấy đối tượng `editUser` hoặc không có thuộc tính `id`');
        }
    };
    const handleEditCancel = () => {
        setEditUser(null);
        setShowEditModal(false);
    };
    // Search Function
    const handleSearch = (event) => {
        setSearchKeyword(event.target.value);
        setPageNumber(1);
    };
    // test
    console.log('Avatar link: ', editUser?.avatar);
    return (
        // Render UI
        <div className={cx('container')}>
            <ToastContainer />
            {/* Header */}
            <div className={cx('content__header')}>
                <div>
                    <select id="role" value={role} onChange={handleRoleChange}>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng bằng tên..."
                    value={searchKeyword}
                    onChange={handleSearch}
                />

                <div className={cx('admin-infor')}>
                    <div className={cx('admin-infor-detail')}>
                        <p className={cx('username')}>{Cookies.get('fullname')}</p>
                        <span className={cx('role')}>{Cookies.get('role')}</span>
                    </div>
                    <img src={Cookies.get('avatar')} />
                </div>
            </div>
            {/* Content */}
            <>
                <div className={cx('table-header')}>
                    <h1 className="table-heading">Accounts Table</h1>
                    <CustomButton icon={faPlus} color="var(--button-primary)" onClick={handleShowRegisterModal} />
                </div>
                <div className={cx('table-wrapper')}>
                    <Table className={cx('table')} hover>
                        <thead className={cx('table-heading')}>
                            <tr className="d-flex">
                                <th className="col-2" scope="col">
                                    Username
                                </th>
                                <th className="col-1" scope="col">
                                    Avatar
                                </th>
                                <th className="col-2" scope="col">
                                    Password
                                </th>
                                <th className="col-2" scope="col">
                                    Fullname
                                </th>
                                <th className="col-2" scope="col">
                                    Email
                                </th>
                                <th className="col-1" scope="col">
                                    Phone
                                </th>
                                <th className="col-1" scope="col">
                                    role
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((user, index) => (
                                <tr className={cx('d-flex')} key={index}>
                                    <td className="col-2">{user.username}</td>
                                    <td className="col-1">
                                        <img className={cx('avatar-table')} src={user.avatar} />
                                    </td>
                                    <td className="col-2">
                                        {/* {user.password.replace(/./g, '*')} */}
                                        <div style={{ overflow: 'hidden' }}>{user.password.replace(/./g, '*')}</div>
                                    </td>
                                    <td className="col-2">{user.fullname}</td>
                                    <td className="col-2" style={{ overflow: 'hidden' }}>
                                        {user.email}
                                    </td>
                                    <td className="col-1">{user.phone}</td>
                                    <td className="col-1">{user.role}</td>
                                    <td className={cx('handle-button', 'col-1')}>
                                        <CustomButton
                                            icon={faPenToSquare}
                                            color="var(--button-primary)"
                                            onClick={() => handleEdit(user)}
                                        />
                                        <CustomButton
                                            icon={faTrashCan}
                                            color="var(--button-danger)"
                                            onClick={() => handleDelete(user.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                {/* Modal Delete */}
                <Modal show={showDeleteModal} onHide={handleDeleteCancel} className={cx('modal')} size="lg">
                    <Modal.Header closeButton className={cx('modal-header')}>
                        <Modal.Title className={cx('modal-title')}>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        Bạn có chắc chắn muốn xóa người dùng này không?
                    </Modal.Body>
                    <Modal.Footer className={cx('modal-footer')}>
                        <Button className={cx('modal-button')} variant="secondary" onClick={handleDeleteCancel}>
                            Hủy
                        </Button>
                        <Button className={cx('modal-button')} variant="danger" onClick={handleDeleteConfirm}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal Edit */}
                <Modal show={showEditModal} onHide={handleEditCancel} size="lg" className={cx('modal')}>
                    <Modal.Header closeButton className={cx('modal-header')}>
                        <Modal.Title className={cx('modal-title')}>Sửa thông tin người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleEditSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="username">Tên đăng nhập:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    defaultValue={editUser?.username}
                                    placeholder="Vui lòng nhập tên đăng nhập"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="avatar">Avatar:</label>
                                {editUser?.avatar && (
                                    <img className={cx('image-preview')} src={editUser?.avatar} alt="Preview" />
                                )}
                                <input className="form-control" type="file" name="avatar" onChange={handleFileChange} />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="password">Mật khẩu:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    defaultValue={editUser?.password}
                                    placeholder="Vui lòng nhập mật khẩu"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="fullname">Họ và tên:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullname"
                                    name="fullname"
                                    defaultValue={editUser?.fullname}
                                    placeholder="Vui lòng nhập họ và tên"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    defaultValue={editUser?.email}
                                    placeholder="Vui lòng nhập địa chỉ email"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Số điện thoại:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    defaultValue={editUser?.phone}
                                    placeholder="Vui lòng nhập số điện thoại"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="role">Role:</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    name="role"
                                    defaultValue={editUser?.role}
                                    placeholder="Vui lòng thay đổi quyền"
                                    style={{ padding: '8px 12px', marginBottom: '16px', fontSize: '16px' }}
                                >
                                    <option value="user" style={{ padding: '8px 12px' }}>
                                        user
                                    </option>
                                    <option value="admin" style={{ padding: '8px 12px' }}>
                                        admin
                                    </option>
                                </select>
                            </div>

                            <div className={cx('modal-form__group')}>
                                <button type="submit" className={cx('modal-button', 'btn-primary', 'btn')}>
                                    Lưu
                                </button>{' '}
                                <button
                                    type="button"
                                    className={cx('modal-button', 'btn-secondary', 'btn')}
                                    onClick={handleEditCancel}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
                {/* Modal Register */}
                <Modal show={showRegisterModal} onHide={handleCloseRegisterModal} className={cx('modal')} size="lg">
                    <Modal.Header closeButton className={cx('modal-header')}>
                        <Modal.Title className={cx('modal-title')}>Tạo người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="username">Tên đăng nhập:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="avatar">Avatar:</label>
                                {formData.avatar && (
                                    <img
                                        className={cx('image-preview')}
                                        src={URL.createObjectURL(formData.avatar)}
                                        alt="Preview"
                                    />
                                )}
                                <input
                                    className="form-control"
                                    type="file"
                                    name="avatar"
                                    onChange={handleInputChange}
                                    placeholder="Chọn hình ảnh"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="password">Mật khẩu:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="fullname">Họ và tên:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullname"
                                    name="fullname"
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    placeholder="Nhập email"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Số điện thoại:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="role">Role:</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    name="role"
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng thay đổi quyền"
                                    style={{ padding: '8px 12px', marginBottom: '16px', fontSize: '16px' }}
                                >
                                    <option value="user" style={{ padding: '8px 12px' }}>
                                        user
                                    </option>
                                    <option value="admin" style={{ padding: '8px 12px' }}>
                                        admin
                                    </option>
                                </select>
                            </div>
                            <div className={cx('modal-form__group')}>
                                <button type="submit" className={cx('modal-button', 'btn-primary', 'btn')}>
                                    {' '}
                                    Lưu{' '}
                                </button>{' '}
                                <button
                                    type="button"
                                    className={cx('modal-button', 'btn-secondary', 'btn')}
                                    onClick={handleEditCancel}
                                >
                                    {' '}
                                    Hủy{' '}
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
                {/* Pagination */}
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={({ selected }) => setPageNumber(selected + 1)}
                    containerClassName={cx('pagination')}
                    activeClassName={cx('active')}
                    previousLabel="<"
                    nextLabel=">"
                />
            </>
        </div>
    );
}

export default Accounts;
