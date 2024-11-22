import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isAscending, setIsAscending] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEditData, setCurrentEditData] = useState({});
    const searchData = ['firstName', 'email'];

    useEffect(() => {
        const oldData = JSON.parse(localStorage.getItem('data')) || [];
        setData(oldData);
    }, []);

    const handleInput = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);
    };

    const handleFilter = () => {
        const sortedData = [...data].sort((a, b) =>
            isAscending ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName)
        );
        setData(sortedData);
        setIsAscending(!isAscending);
    };

    const handleDelete = (index) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
    };

    const handleEdit = (item, index) => {
        setCurrentEditData({ ...item, index });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        const newData = [...data];
        newData[currentEditData.index] = {
            firstName: currentEditData.firstName,
            email: currentEditData.email,
        };
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
        setShowEditModal(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <Input type="search" name="search" onChange={handleInput} label="Search" />
            <Link to="/">
                <Button style={{ margin: '5px 10px' }} className="mb-3" variant="primary">
                    Add Data
                </Button>
            </Link>
            <Button variant="primary" onClick={handleFilter}>
                Filter {isAscending ? <FaCaretDown /> : <FaCaretUp />}
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        {searchData.map((val, key) => (
                            <th key={key}>{val}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData
                        .filter((val) =>
                            searchData.some((key) => val[key]?.toString().toLowerCase().includes(search))
                        )
                        .map((item, index) => (
                            <tr key={index}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                {searchData.map((key, i) => (
                                    <td key={i}>{item[key]}</td>
                                ))}
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEdit(item, indexOfFirstRow + index)}
                                        style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(indexOfFirstRow + index)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </Button>
                <span style={{ alignSelf: 'center' }}>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </Button>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={currentEditData.firstName || ''}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="editEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={currentEditData.email || ''}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DataTable;
