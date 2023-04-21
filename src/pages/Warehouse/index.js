import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import styles from './Warehouse.module.scss';
import classNames from 'classnames/bind';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CustomButton from '~/components/CustomButton';
import { faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';

import ReactPaginate from 'react-paginate';
var cx = classNames.bind(styles);

function Warehouse() {
    const [items, setItems] = useState([]);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editOrder, seteditOrder] = useState(null);

    const [pageNumber, setPageNumber] = useState(1); // trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // tổng số trang

    const [searchKeyword, setSearchKeyword] = useState('');

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [category, setCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    // URL hình ảnh
    const [file, setFile] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        madanhmuc: '',
        tenmon: '',
        hinhmon: null,
        gia: '',
        mota: '',
    });
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPageNumber(1);
    };
    // Handle File Change
    const handleFileChange = (event) => {
        const selectedFile = URL.createObjectURL(event.target.files[0]);
        seteditOrder((prevEditOrder) => ({
            ...prevEditOrder,
            hinhmon: selectedFile,
        }));
    };
    // Register Function
    const handleInputChange = (event) => {
        if (event.target.name === 'hinhmon') {
            setFormData({
                ...formData,
                hinhmon: event.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        }
    };
    const handleSubmit = (event) => {
        const { madanhmuc, tenmon, hinhmon, gia, mota } = formData;
        const regexInteger = /^[0-9]+$/;

        event.preventDefault();

        let errorMessages = [];

        // Kiểm tra điều kiện
        if (!['1', '2', '3', '4'].includes(madanhmuc)) {
            errorMessages.push('Vui lòng nhập mã danh mục hợp lệ!');
        }

        if (!tenmon) {
            errorMessages.push('Vui lòng chọn tên món!');
        }

        if (!hinhmon || hinhmon.name === '') {
            errorMessages.push('Vui lòng chọn hình món!');
        }

        if (!regexInteger.test(gia)) {
            errorMessages.push('Vui lòng nhập giá là số nguyên!');
        }

        if (!mota) {
            errorMessages.push('Vui lòng nhập mô tả!');
        }

        // Nếu có lỗi, hiển thị thông báo duy nhất
        if (errorMessages.length > 0) {
            errorMessages.forEach((message) => {
                toast.error(message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        } else {
            // Nếu kiểm tra điều kiện qua được, thực hiện gửi request
            axios
                .post('/AppFood/taomon.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    handleCloseRegisterModal();
                    toast.success('Tạo món thành công!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                })
                .catch((error) => {
                    toast.error('Tạo món thất bại!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
        }
    };

    const handleShowRegisterModal = () => setShowRegisterModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);
    // Call API Render
    useEffect(() => {
        axios
            .get(`/AppFood/mon.php?page=${pageNumber}&search=${searchKeyword}&category=${category}`)
            .then((response) => {
                const formattedItems = response.data.result.map((item) => {
                    const formattedPrice = parseInt(item.gia).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                    return { ...item, gia: formattedPrice };
                });
                setItems(formattedItems);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [pageNumber, searchKeyword, category]);
    //
    useEffect(() => {
        axios
            .get(`/AppFood/danhmuc.php`)
            .then((response) => {
                const categoryNames = response.data.result.map((category) => category.tendanhmuc);
                setCategories(response.data.result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // Delete Function
    const handleDelete = (id) => {
        setDeleteItemId(id);
        setShowDeleteModal(true);
    };
    const handleDeleteConfirm = () => {
        axios
            .delete(`/AppFood/deleteproduct.php?id=${deleteItemId}`)
            .then(() => {
                // Cập nhật lại danh sách sau khi xóa thành công
                setItems(items.filter((item) => item.id !== deleteItemId));
                setShowDeleteModal(false);
                // Toast
                toast.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.log(error);
                // Toast
                toast.error('Xóa thất bại!');
            });
    };
    const handleDeleteCancel = () => {
        setDeleteItemId(null);
        setShowDeleteModal(false);
    };
    // Edit Function
    const handleEdit = (product) => {
        seteditOrder(product);
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const madanhmuc = formData.get('madanhmuc') ?? '';
        const tenmon = formData.get('tenmon') ?? '';
        const hinhmon = formData.get('hinhmon') ?? '';
        const gia = formData.get('gia') ?? '';
        const mota = formData.get('mota') ?? '';
        const regexInteger = /^[0-9]+$/;
        let errorMessages = [];

        if (editOrder && editOrder.hasOwnProperty('id')) {
            if (!['1', '2', '3', '4'].includes(madanhmuc)) {
                errorMessages.push('Vui lòng nhập mã danh mục hợp lệ!');
            }

            if (!tenmon) {
                errorMessages.push('Vui lòng chọn tên món!');
            }

            if (!hinhmon || hinhmon.name === '') {
                errorMessages.push('Vui lòng chọn hình món!');
            }

            if (!regexInteger.test(gia)) {
                errorMessages.push('Vui lòng nhập giá là số nguyên!');
            }

            if (!mota) {
                errorMessages.push('Vui lòng nhập mô tả!');
            }
            // Display error messages
            if (errorMessages.length > 0) {
                errorMessages.forEach((message) => {
                    toast.error(message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            } else {
                axios
                    .post(
                        `/AppFood/updatemon.php?`,
                        {
                            id: editOrder.id,
                            madanhmuc,
                            tenmon,
                            hinhmon,
                            gia,
                            mota,
                        },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    )
                    .then((response) => {
                        if (response.data) {
                            toast.success('Đã edit thành công!');
                            // Cập nhật lại danh sách sau khi sửa thành công
                            setItems(
                                items.map((item) =>
                                    item.id === editOrder.id
                                        ? {
                                              ...item,
                                              madanhmuc,
                                              tenmon,
                                              gia,
                                              mota,
                                              hinhmon: hinhmon ? URL.createObjectURL(hinhmon) : item.hinhmon,
                                          }
                                        : item,
                                ),
                            );
                            setShowEditModal(false);
                            seteditOrder(null);
                        } else {
                            errorMessages.push('Edit thất bại!');
                        }
                    })
                    .catch((error) => {
                        errorMessages.push('Edit thất bại!');
                        console.log(error);
                    });
            }
        } else {
            console.log('Không tìm thấy đối tượng `editOrder` hoặc không có thuộc tính `id`');
        }
    };

    const handleEditCancel = () => {
        seteditOrder(null);
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
                <div className={cx('content__header')}>
                    <div>
                        <select id="category" value={category} onChange={handleCategoryChange}>
                            <option value="all">Tất cả</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.tendanhmuc}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm món bằng tên món..."
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
                <div className={cx('table-header')}>
                    <h1 className="table-heading">Warehouse Table</h1>
                    <CustomButton icon={faPlus} color="var(--button-primary)" onClick={handleShowRegisterModal} />
                </div>
                <div className={cx('table-wrapper')}>
                    <Table className={cx('table')} hover >
                        <thead className={cx('table-heading')}>
                            <tr className="d-flex">
                                <th className="col-2" scope="col">
                                    Tên món ăn
                                </th>
                                <th className="col-2" scope="col">
                                    Hình ảnh
                                </th>
                                <th className="col-1" scope="col">
                                    Giá
                                </th>
                                <th className="col-6" scope="col">
                                    Mô tả
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((product, index) => (
                                <tr className={cx('d-flex')} key={index}>
                                    <td className={cx('col-2', 'item__name')}>
                                        <p className={cx('item__name--text')}>{product.tenmon}</p>
                                    </td>
                                    <td className={cx('col-2', 'item__image')}>
                                        <img className={cx('item__image--inner')} src={product.hinhmon} alt="" />
                                    </td>
                                    <td className={cx('col-1', 'd-flex', 'item__cost')}>
                                        <p className={cx('item__cost--text')}>{product.gia}</p>
                                    </td>
                                    <td className="col-6">
                                        <p>{product.mota}</p>
                                    </td>
                                    <td className={cx('handle-button', 'col-1')}>
                                        <CustomButton
                                            icon={faPenToSquare}
                                            color="var(--button-primary)"
                                            onClick={() => handleEdit(product)}
                                        />
                                        <CustomButton
                                            icon={faTrashCan}
                                            color="var(--button-danger)"
                                            onClick={() => handleDelete(product.id)}
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
                {/* Model Edit */}
                <Modal show={!!editOrder} onHide={handleEditCancel} size="lg" className={cx('modal-edit')}>
                    <Modal.Header closeButton className={cx('modal-header')}>
                        <Modal.Title className={cx('modal-title')}>Sửa thông tin sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleEditSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="madanhmuc">
                                    Mã danh mục:{' '}
                                    <span className={cx('note')}>
                                        {' '}
                                        (1: Món chính, 2: Burger, 3: Đồ uống, 4: Món phụ)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="madanhmuc"
                                    name="madanhmuc"
                                    defaultValue={editOrder?.madanhmuc}
                                    placeholder="Vui lòng nhập mã danh mục"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tenmon">Tên món:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenmon"
                                    name="tenmon"
                                    defaultValue={editOrder?.tenmon}
                                    placeholder="Vui lòng nhập tên món"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="hinhmon">Hình Món:</label>
                                {editOrder?.hinhmon && (
                                    <img className={cx('image-preview')} src={editOrder?.hinhmon} alt="Preview" />
                                )}
                                <input
                                    className="form-control"
                                    type="file"
                                    name="hinhmon"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="gia">Giá:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="gia"
                                    name="gia"
                                    defaultValue={editOrder?.gia?.replace(/\D/g, '')}
                                    placeholder="Vui lòng nhập giá"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="mota">Mô tả:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="mota"
                                    name="mota"
                                    defaultValue={editOrder?.mota}
                                    placeholder="Vui lòng nhập mô tả"
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
                <Modal show={showRegisterModal} onHide={handleCloseRegisterModal} size="lg">
                    <Modal.Header className={cx('modal-header')} closeButton>
                        <Modal.Title className={cx('modal-title')}>Tạo sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={cx('modal-body')}>
                        <form className={cx('modal-form')} onSubmit={handleSubmit}>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="madanhmuc">
                                    Mã danh mục:{' '}
                                    <span className={cx('note')}>
                                        {' '}
                                        (1: Món chính, 2: Burger, 3: Đồ uống, 4: Món phụ)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="madanhmuc"
                                    name="madanhmuc"
                                    onChange={handleInputChange}
                                    placeholder="Nhập mã danh mục"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="tenmon">Tên món:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenmon"
                                    name="tenmon"
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên món"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="hinhmon">Hình món:</label>
                                {formData.hinhmon && (
                                    <img
                                        className={cx('image-preview')}
                                        src={URL.createObjectURL(formData.hinhmon)}
                                        alt="Preview"
                                    />
                                )}
                                <input
                                    className="form-control"
                                    type="file"
                                    name="hinhmon"
                                    onChange={handleInputChange}
                                    placeholder="Chọn hình ảnh"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="gia">Giá:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="gia"
                                    name="gia"
                                    onChange={handleInputChange}
                                    placeholder="Nhập giá"
                                />
                            </div>
                            <div className={cx('modal-form__group')}>
                                <label htmlFor="mota">Mô tả:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="mota"
                                    name="mota"
                                    onChange={handleInputChange}
                                    placeholder="Nhập mô tả"
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

export default Warehouse;
