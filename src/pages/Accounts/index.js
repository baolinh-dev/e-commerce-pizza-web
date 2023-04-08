import CustomButton from '~/components/CustomButton';
import React, { useEffect, useState } from 'react';
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
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    });
    // Register Function
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
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
    };
    const handleShowRegisterModal = () => setShowRegisterModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);
    // Get Function
    useEffect(() => {
        axios
            .get(`/AppFood/user.php?page=${pageNumber}&search=${searchKeyword}`)
            .then((response) => {
                setItems(response.data.result);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [pageNumber, searchKeyword, isEditSuccess]); 
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
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username') ?? '';
        const password = formData.get('password') ?? '';
        const email = formData.get('email') ?? '';
        const phone = formData.get('phone') ?? '';

        if (editUser && editUser.hasOwnProperty('id')) {
            if (username && password && email && phone) {
                axios
                    .post(
                        `/AppFood/updateuser.php?`,
                        {
                            id: editUser.id,
                            username,
                            password,
                            email,
                            phone,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        },
                    )
                    .then((response) => {
                        if (response.data) {
                            toast.success('Đã edit thành công!');
                            // Cập nhật lại danh sách sau khi sửa thành công
                            setItems(
                                items.map((item) =>
                                    item.id === editUser.id ? { ...item, username, password, email, phone } : item,
                                ),
                            );
                            setShowEditModal(false);
                            setEditUser(null); 
                            setIsEditSuccess(true)
                        } else {
                            toast.error('Edit thất bại!');
                        }
                    })
                    .catch((error) => {
                        toast.error('Edit thất bại!');
                        console.log(error);
                    });
            } else {
                toast.error('Vui lòng điền đầy đủ thông tin!');
            }
        } else {
            console.log('Không tìm thấy đối tượng `editUser` hoặc không có thuộc tính `id`');
        }
    };    
    console.log(items);
    const handleEditCancel = () => {
        setEditUser(null);
        setShowEditModal(false);
    };
    // Search Function
    const handleSearch = (event) => {
        setSearchKeyword(event.target.value);
        setPageNumber(1);
    };
    return (
        // Render UI
        <div className={cx('container')}>
            <ToastContainer />
            {/* Header */}
            <div className={cx('content__header')}>
                <div></div>
                <input type="text" placeholder="Tìm kiếm người dùng bằng tên..." value={searchKeyword} onChange={handleSearch} />
                <CustomButton icon={faPlus} color="var(--button-primary)" onClick={handleShowRegisterModal} />
            </div>
            {/* Content */}
            <>
                <Table className={cx('table')} hover>
                    <thead className={cx('table-heading')}>
                        <tr className="d-flex">
                            <th className="col-2" scope="col">
                                Username
                            </th>
                            <th className="col-2" scope="col">
                                Password
                            </th>
                            <th className="col-2" scope="col">
                                Email
                            </th>
                            <th className="col-6" scope="col">
                                Phone
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((user, index) => (
                            <tr className={cx('d-flex')} key={index}>
                                <td className="col-2">{user.username}</td>
                                <td className="col-2">
                                    <div style={{ overflow: 'hidden' }}>{user.password.replace(/./g, '*')}</div>
                                </td>
                                <td className="col-2">{user.email}</td>
                                <td className="col-5">{user.phone}</td>
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
                                <label htmlFor="username">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    defaultValue={editUser?.username}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    defaultValue={editUser?.password}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    defaultValue={editUser?.email}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    defaultValue={editUser?.phone}
                                />
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
                        <Modal.Title className={cx('modal-title')}>Register</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="username">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
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
