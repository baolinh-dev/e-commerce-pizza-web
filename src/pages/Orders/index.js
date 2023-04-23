import CustomButton from '~/components/CustomButton';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import ReactPaginate from 'react-paginate';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { zonedTimeToUtc, format } from 'date-fns-tz';

var cx = classNames.bind(styles);

function Order() {
    // useState
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [editOrder, setEditOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        tenkhachhang: '',
        fullname: '',
        email: '',
        sodienthoai: '',
        ngaydathang: '',
        tongtien: '',
        ghichu: '',
    });

    // Register Function
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    console.log(formData);
    const handleSubmit = (event) => {
        event.preventDefault();
        const { tenkhachhang, fullname, email, sodienthoai, ngaydathang, tongtien, ghichu } = formData;
        const regexInteger = /^[0-9]+$/;
        let errorMessages = [];

        // Check for errors
        if (!tenkhachhang) {
            errorMessages.push('Vui lòng nhập tên khách hàng!');
        }

        if (!fullname) {
            errorMessages.push('Vui lòng nhập họ và tên khách hàng!');
        }

        if (!email) {
            errorMessages.push('Vui lòng nhập email!');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errorMessages.push('Email không hợp lệ!');
        }

        if (!sodienthoai) {
            errorMessages.push('Vui lòng nhập số điện thoại!');
        } else if (!regexInteger.test(sodienthoai)) {
            errorMessages.push('Số điện thoại phải là số nguyên!');
        }

        if (!ngaydathang) {
            errorMessages.push('Vui lòng chọn ngày đặt hàng!');
        }

        if (!tongtien) {
            errorMessages.push('Vui lòng nhập tổng tiền!');
        } else if (!regexInteger.test(tongtien)) {
            errorMessages.push('Tổng tiền phải là số nguyên!');
        }

        if (!ghichu) {
            errorMessages.push('Vui lòng nhập tên khách hàng!');
        }

        // If there are errors, display toast message(s)
        if (errorMessages.length > 0) {
            errorMessages.forEach((errorMessage) => {
                toast.error(errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        } else {
            // Submit the form data if there are no errors
            axios
                .post('/AppFood/taodonhang.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    handleCloseRegisterModal();
                    toast.success('Tạo đơn hàng thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Tạo đơn hàng thất bại!', {
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
        axios
            .get(`/AppFood/donhang.php?page=${pageNumber}&search=${searchKeyword}`)
            .then((response) => {
                const formattedItems = response.data.result.map((item) => {
                    const formattedPrice = parseInt(item.tongtien).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                    return { ...item, tongtien: formattedPrice };
                });
                setItems(formattedItems);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [pageNumber, searchKeyword]);
    // Delete Fucntion
    const handleDelete = (id) => {
        setDeleteItemId(id);
        setShowDeleteModal(true);
    };
    const handleDeleteConfirm = () => {
        axios
            .delete(`/AppFood/deleteorder.php?id=${deleteItemId}`)
            .then(() => {
                // Cập nhật lại danh sách sau khi xóa thành công
                setItems(items.filter((item) => item.id !== deleteItemId));
                setShowDeleteModal(false);
                // Toast xóa thành công
                toast.success('Đã xóa thành công!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                console.log(error);
                // Toast xóa thất bại
                toast.error('Xóa thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };
    const handleDeleteCancel = () => {
        setDeleteItemId(null);
        setShowDeleteModal(false);
    };
    // Edit Function
    const handleEdit = (order) => {
        setEditOrder(order);
        setShowEditModal(true);
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const tenkhachhang = formData.get('tenkhachhang') ?? '';
        const fullname = formData.get('fullname') ?? '';
        const email = formData.get('email') ?? '';
        const sodienthoai = formData.get('sodienthoai') ?? '';
        const ngaydathang = formData.get('ngaydathang') ?? '';
        const tongtien = formData.get('tongtien') ?? '';
        const ghichu = formData.get('ghichu') ?? '';
        const regexInteger = /^[0-9]+$/;
        let errorMessages = [];

        // Check for errors
        if (!tenkhachhang) {
            errorMessages.push('Vui lòng nhập username khách hàng!');
        }

        if (!fullname) {
            errorMessages.push('Vui lòng nhập họ và tên khách hàng!');
        }

        if (!email) {
            errorMessages.push('Vui lòng nhập email!');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errorMessages.push('Email không hợp lệ!');
        }

        if (!sodienthoai) {
            errorMessages.push('Vui lòng nhập số điện thoại!');
        } else if (!regexInteger.test(sodienthoai)) {
            errorMessages.push('Số điện thoại phải là số nguyên!');
        }

        if (!ngaydathang) {
            errorMessages.push('Vui lòng chọn ngày đặt hàng!');
        }

        if (!tongtien) {
            errorMessages.push('Vui lòng chọn ngày đặt hàng!');
        } else if (!regexInteger.test(tongtien)) {
            errorMessages.push('Tổng tiền phải là số nguyên!');
        }

        if (!ghichu) {
            errorMessages.push('Vui lòng nhập ghi chú!');
        }

        // If there are errors, display toast message(s)
        if (errorMessages.length > 0) {
            errorMessages.forEach((errorMessage) => {
                toast.error(errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        } else {
            axios
                .post(
                    `/AppFood/updatedonhang.php`,
                    {
                        id: editOrder.id,
                        tenkhachhang,
                        fullname,
                        email,
                        sodienthoai,
                        ngaydathang,
                        tongtien,
                        ghichu,
                    },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                .then(() => {
                    // Update the list after successful edit
                    setItems(
                        items.map((item) =>
                            item.id === editOrder.id
                                ? { ...item, tenkhachhang, fullname, email, sodienthoai, ngaydathang, tongtien, ghichu }
                                : item,
                        ),
                    );
                    setShowEditModal(false);
                    setEditOrder(null);
                    // Toast
                    toast.success('Chỉnh sửa thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    // Toast
                    toast.error('Chỉnh sửa thất bại!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
        }
    };
    const handleEditCancel = () => {
        setEditOrder(null);
        setShowEditModal(false);
    };
    // Search Function
    const handleSearch = (event) => {
        setSearchKeyword(event.target.value);
        setPageNumber(1);
    };
    // Render UI
    return (
        <div className={cx('container')}>
            <>
                <ToastContainer />
                {/* Header */}
                <div className={cx('content__header')}>
                    <div></div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng bằng tên khách hàng..."
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
                {/* Body */}
                <div className={cx('table-header')}>
                    <h1 className="table-heading">Orders Table</h1>
                    <CustomButton
                        icon={faPlus}
                        color="var(--button-primary)"
                        onClick={handleShowRegisterModal}
                        style={{
                            boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
                            border: 'none',
                        }}
                    />
                </div>
                <div className={cx('table-wrapper')}>
                    <Table style={{ border: `1px solid #ddd` }} className={cx('table')} hover>
                        <thead className={cx('table-heading')}>
                            <tr className="d-flex">
                                <th className="col-1" scope="col">
                                    Username
                                </th>
                                <th className="col-2" scope="col">
                                    Họ và tên
                                </th>
                                <th className="col-2" scope="col">
                                    Email
                                </th>
                                <th className="col-1" scope="col">
                                    Điện thoại
                                </th>
                                <th className="col-1" scope="col">
                                    Date
                                </th>
                                <th className="col-1" scope="col">
                                    Tổng tiền
                                </th>
                                <th className="col-3" scope="col">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((order, index) => (
                                <tr className={cx('d-flex')} key={index}>
                                    <td className={cx('col-1', 'item__name')}>
                                        <p className={cx('item__name--text')}>{order.tenkhachhang}</p>
                                    </td>
                                    <td className="col-2" style={{ overflow: 'hidden' }}>
                                        {order.fullname}
                                    </td>
                                    <td className="col-2" style={{ overflow: 'hidden' }}>
                                        {order.email}
                                    </td>
                                    <td className="col-1">{order.sodienthoai}</td>
                                    <td className="col-1">{order.ngaydathang}</td>
                                    <td className="col-1">{order.tongtien}</td>
                                    <td className="col-3">{order.ghichu}</td>
                                    <td className={cx('handle-button', 'col-1')}>
                                        <CustomButton
                                            icon={faPenToSquare}
                                            color="var(--button-primary)"
                                            onClick={() => handleEdit(order)}
                                        />
                                        <CustomButton
                                            icon={faTrashCan}
                                            color="var(--button-danger)"
                                            onClick={() => handleDelete(order.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                {/* Modal Delete */}
                <Modal show={showDeleteModal} onHide={handleDeleteCancel} size="lg" className={cx('modal')}>
                    <Modal.Header closeButton className={cx('modal-header')}>
                        <Modal.Title className={cx('modal-title')}>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        Bạn có chắc chắn muốn xóa người dùng này không?
                    </Modal.Body>
                    <Modal.Footer className={cx('modal-footer')}>
                        <Button onClick={handleDeleteCancel} className={cx('modal-button', 'btn-secondary', 'btn')}>
                            Hủy
                        </Button>
                        <Button onClick={handleDeleteConfirm} className={cx('modal-button', 'btn-danger', 'btn')}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal Edit */}
                <Modal className={cx('modal')} show={showEditModal} onHide={handleEditCancel} size="lg">
                    <Modal.Header className={cx('modal-header')} closeButton>
                        <Modal.Title className={cx('modal-title')}>Chỉnh sửa thông tin đơn hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleEditSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tenkhachhang">Username:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenkhachhang"
                                    name="tenkhachhang"
                                    defaultValue={editOrder?.tenkhachhang}
                                    placeholder="Vui lòng nhập tên khách hàng"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="fullname">Fullname:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullname"
                                    name="fullname"
                                    defaultValue={editOrder?.fullname}
                                    placeholder="Vui lòng nhập tên khách hàng"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="password">Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    defaultValue={editOrder?.email}
                                    placeholder="Vui lòng nhập email"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="sodienthoai">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sodienthoai"
                                    name="sodienthoai"
                                    defaultValue={editOrder?.sodienthoai}
                                    placeholder="Vui lòng nhập số điện thoại"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="ngaydathang">Ngày Đặt Hàng</label>
                                {/* <input
                                    type="date"
                                    className="form-control"
                                    id="ngaydathang"
                                    name="ngaydathang"
                                    defaultValue={editOrder?.ngaydathang}
                                /> */}
                                <DatePicker
                                    selected={formData.ngaydathang}
                                    onChange={(date) => setFormData({ ...formData, ngaydathang: date })}
                                    className="form-control"
                                    id="ngaydathang"
                                    name="ngaydathang"
                                    dateFormat="yyyy/MM/dd"
                                    todayButton="Today"
                                    defaultValue={editOrder?.ngaydathang}
                                    placeholderText="Chọn ngày đặt hàng"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Tổng Tiền</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tongtien"
                                    name="tongtien"
                                    placeholder="Vui lòng nhập tổng tiền"
                                    defaultValue={editOrder?.tongtien?.replace(/\D/g, '')}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Ghi Chú</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ghichu"
                                    name="ghichu"
                                    placeholder="Vui lòng nhập ghi chú"
                                    defaultValue={editOrder?.ghichu}
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
                <Modal className={cx('modal')} show={showRegisterModal} onHide={handleCloseRegisterModal} size="lg">
                    <Modal.Header className={cx('modal-header')} closeButton>
                        <Modal.Title className={cx('modal-title')}>Tạo đơn hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tenkhachhang">Username:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenkhachhang"
                                    name="tenkhachhang"
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng nhập tên username"
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
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng nhập địa chỉ email"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="sodienthoai">Số điện thoại:</label>
                                <input
                                    type="sodienthoai"
                                    className="form-control"
                                    id="sodienthoai"
                                    name="sodienthoai"
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng nhập số điện thoại"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="ngaydathang">Ngày đặt hàng:</label>
                                <DatePicker
                                    selected={formData.ngaydathang}
                                    onChange={(date) =>
                                        setFormData({
                                            ...formData,
                                            ngaydathang: date,
                                        })
                                    }
                                    dateFormat="yyyy/MM/dd"
                                    className="form-control"
                                    id="ngaydathang"
                                    name="ngaydathang"
                                    placeholderText="Chọn ngày đặt hàng"
                                    todayButton="Today"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tongtien">Tổng tiền:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tongtien"
                                    name="tongtien"
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng nhập tổng tiền"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="ghichu">Ghi chú:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ghichu"
                                    name="ghichu"
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng nhập ghi chú"
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

export default Order;
