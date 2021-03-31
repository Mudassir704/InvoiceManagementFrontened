import React,{ useState, useRef, useCallback } from 'react';
import { Nav, Navbar, Table, Modal, Button, Form } from 'react-bootstrap';
import DataService from './DataService';
import axios from 'axios'

const Home = () => {
    const [show, setShow] = useState(false);
    const [addShow, setAddShow] = useState(false);
    const [id, setId] = useState();
    const [invoiceId, setInvoiceId] = useState();
    const [amount, setAmount] = useState();
    const [localLoading, setLocalLoading] = useState(true);
    const [pageNumber, setPageNumeber] = useState(1);
    const {loading, error, invoices, hasMore} = DataService(pageNumber);
    const observer = useRef()
    const lastInvoiceRef = useCallback((node) => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore){
                setPageNumeber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node);
    },[loading, hasMore])
    

    const table = ["id", "businessCode", "invoiceId", "name", "number", "invoiceCurrency", "clearDate", "businessYear", "docId", "postingDate", "documentCreateDate", "dueInDate", "postingId", "totalOpenAmount", "custPaymentTerms", "isOpen"]
    const header = ["Id", "Business Code", "Invoice Id", "Name", "Number", "Invoice Currency", "Clear Date", "Business Year", "Doc Id", "Posting Date", "Document Create Date", "Due In Date", "Posting Id", "Total Open Amount", "Customer Payment Terms", "Is Open"]

    const handleDelete = (id) =>{
        setLocalLoading(true);
        axios.delete(`http://localhost:8080/invoices/${id}`);
        setPageNumeber(prevPageNumber => prevPageNumber + 0.1);
        setLocalLoading(false);
    }

    const handleEdit = (invoice) => {
        setId(invoice["id"]);
        setInvoiceId(invoice["invoiceId"]);
        setAmount(invoice["totalOpenAmount"]);
        setShow(true);

    }

    const handleClose = () => {
        setShow(false)
        setAddShow(false)
    };

    const handleSubmit = () => {
        invoices.map(invoice => {
                console.log(invoice["invoiceId"] );
                if(invoice["id"] === id){ 
                    invoice["invoiceId"] = invoiceId;
                    invoice["totalOpenAmount"] = amount;
                    return null;
                }
                return null;
        })
        setShow(false);
    }

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Invoice Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    {/* <Nav.Link href="#features">Add Invoice</Nav.Link> */}
                    <Nav.Link onClick={() => setAddShow(true)} href="#pricing">Add Invoice</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Table responsive>
                <thead>
                    <tr>
                        <th key={1}>Action
                            {console.log(localLoading) && <i className="fa fa-spinner fa-lg fa-spin"></i>}
                        </th>
                        {header.map((headItem, index) => (
                            <th key={index}>{headItem}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => {
                        if(invoices.length === index + 1){
                            return ( 
                                <tr ref={lastInvoiceRef} key={index}>
                                    <td key={invoice["id"]}>
                                        <i className="fa fa-pencil fa-lg" onClick = {() => {handleEdit(invoice)}}></i>{"\t"}
                                        <i className="fa fa-trash fa-lg" onClick={() => handleDelete(invoice["id"])}></i> 
                                    </td>
                                    {table.map((tableItem, index) => (
                                        <td key={index}> {invoice[tableItem]}</td>
                                    ))} 
                                </tr>
                            )
                        } else {
                            return(<tr key={index}>
                                <td key={invoice["id"]}>
                                    <i className="fa fa-pencil fa-lg" onClick = {() => {handleEdit(invoice)}}></i>{"\t"}
                                    <i className="fa fa-trash fa-lg" onClick={() => handleDelete(invoice["id"])}></i> 
                                </td>
                                {table.map((tableItem, index) => (
                                    <td key={index}> {invoice[tableItem]}</td>
                                ))} 
                            </tr>)
                        }
                    })}
                </tbody>
            </Table>
            <div className="App">
                {loading && <i className="fa fa-spinner fa-lg fa-spin"></i>}
            </div>
            <div className="App">
                {error && <i className="fa fa-spinner fa-lg fa-spin"/>}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                    <Form.Label>Invoice Id</Form.Label>
                    <Form.Control type="number" value = {invoiceId} onChange = {(e) => setInvoiceId(e.target.value)} placeholder="Invoice Id" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Total Open Amount</Form.Label>
                    <Form.Control type="number" value={amount} onChange = {(e) => setAmount(e.target.value)} placeholder="Amount" />
                    </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={addShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                    <Form.Label>Invoice Id</Form.Label>
                    <Form.Control type="number" value = {invoiceId}  placeholder="Invoice Id" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Total Open Amount</Form.Label>
                    <Form.Control type="number" value={amount} placeholder="Amount" />
                    </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Home;