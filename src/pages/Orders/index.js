import CustomButton from '~/components/CustomButton';
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
        email: '',
        sodienthoai: '',
        tongtien: '',
        ghichu: '',
        ngaydathang: '',
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
        const email = formData.get('email') ?? '';
        const sodienthoai = formData.get('sodienthoai') ?? '';
        const tongtien = formData.get('tongtien') ?? '';
        const ghichu = formData.get('ghichu') ?? '';
        axios
            .post(
                `/AppFood/updatedonhang.php`,
                {
                    id: editOrder.id,
                    tenkhachhang,
                    email,
                    sodienthoai,
                    tongtien,
                    ghichu,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            )
            .then(() => {
                // Cập nhật lại danh sách sau khi sửa thành công
                setItems(
                    items.map((item) =>
                        item.id === editOrder.id
                            ? { ...item, tenkhachhang, email, sodienthoai, tongtien, ghichu }
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
                toast.success('Chỉnh sửa thất bại!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
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
                        placeholder="Search orders by client name"
                        value={searchKeyword}
                        onChange={handleSearch}
                    />
                    <CustomButton icon={faPlus} color="var(--button-primary)" onClick={handleShowRegisterModal} />
                </div> 
                {/* Body */}
                <Table className={cx('table')} hover>
                    <thead className={cx('table-heading')}>
                        <tr className="d-flex">
                            <th className="col-2" scope="col">
                                Tên Khách Hàng
                            </th>
                            <th className="col-2" scope="col">
                                Email
                            </th>
                            <th className="col-1" scope="col">
                                Điện thoại
                            </th>
                            <th className="col-2" scope="col">
                                Ngày đặt hàng
                            </th>
                            <th className="col-1" scope="col">
                                Tổng Tiền
                            </th>
                            <th className="col-3" scope="col">
                                Ghi chú
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((order, index) => (
                            <tr className={cx('d-flex')} key={index}>
                                <td className={cx('col-2', 'item__name')}>
                                    <p className={cx('item__name--text')}>{order.tenkhachhang}</p>
                                </td>

                                <td className="col-2">{order.email}</td>
                                <td className="col-1">{order.sodienthoai}</td>
                                <td className="col-2">{order.ngaydathang}</td>
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
                        <Modal.Title className={cx('modal-title')}>Sửa thông tin đơn hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleEditSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="username">Tên Khách Hàng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenkhachhang"
                                    name="tenkhachhang"
                                    defaultValue={editOrder?.tenkhachhang}
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
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="email">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sodienthoai"
                                    name="sodienthoai"
                                    defaultValue={editOrder?.sodienthoai}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="phone">Tổng Tiền</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tongtien"
                                    name="tongtien"
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
                        <Modal.Title className={cx('modal-title')}>Register</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tenkhachhang">Tên khách hàng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenkhachhang"
                                    name="tenkhachhang"
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
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="sodienthoai">Số điện thoại</label>
                                <input
                                    type="sodienthoai"
                                    className="form-control"
                                    id="sodienthoai"
                                    name="sodienthoai"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tongtien">Tổng tiền</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tongtien"
                                    name="tongtien"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="ghichu">Ghi chú</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ghichu"
                                    name="ghichu"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="ngaydathang">Ngày đặt hàng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ngaydathang"
                                    name="ngaydathang"
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

export default Order;
