import axios from 'axios';
import React, { useState , useRef, useCallback} from 'react'
import { Navbar, Table, Nav, Modal, Form, Button, Col, Row, Container } from 'react-bootstrap'
import DataService from './DataService';
import { CSVLink } from 'react-csv';


const MiniHome = () => {
    const [input, setInput] = useState('');
    const [id, setId] = useState(0)
    const [invoiceId, setInvoiceId] = useState("")
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [show, setShow] = useState(false);
    const [pageNumber, setPageNumeber] = useState(1);
    const {loading, error, invoices, hasMore} = DataService(pageNumber);
    const [currentInvoice, setCurrentInvoice] = useState({});
    const [download, setDownload] = useState([]);
    const observer = useRef()
    const headers = [
        {label: "id", key: "id"},
        {label: "invoiceId", key: "invoiceId"},
        {label: "name", key: "name"},
        {label: "totalOpenAmount", key: "totalOpenAmount"},
    ]

    const csvReport = {
        filename: "invoice.csv",
        headers: headers,
        data: download
    }
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
    const table = ["id","invoiceId", "name", "totalOpenAmount"]

    const handleCheckChieldElement = (invoice) => {
        invoices.forEach((inv) => {
            if(inv["id"] === invoice["id"]){
                setDownload([...download, inv])
            }
        })
        console.log(download);
    }

    const handleEdit = (invoice) => {
        setId(invoice["id"])
        setInvoiceId(invoice["invoiceId"])
        setName(invoice["name"])
        setAmount(invoice["totalOpenAmount"])
        setShow(true);
    }

    const updateInput = () => {
        invoices.map(invoice => {
            if(invoice["id"] === parseInt(input)){
                console.log(typeof(invoice));
                setCurrentInvoice(invoice)
                return null;
            }
            return null;
        });
        setInput('');
        console.log(currentInvoice);
     }

    const handleClose = () => {
        setShow(false);
        setAmount(0)
        setId(0)
        setName("")
        setInvoiceId("")
    }

    const handleDelete = (id) =>{
        axios.delete(`http://localhost:8080/invoices/${id}`);
        setPageNumeber(prevPageNumber => prevPageNumber + 0.1);
        if(currentInvoice["id"])
            setCurrentInvoice([]);
    }

    const handleSubmit = () => {
        console.log(lastInvoiceRef);
        var invoice = {};
        invoice["invoiceId"] = invoiceId;
        invoice["totalOpenAmount"] = amount;
        invoice["name"] = name;
        if(id === 0){
            invoices.push(invoice);
            axios.post("http://localhost:8080/invoices", invoice)
            console.log(invoice);
        }
        else {
        invoices.map(invoice => {
            console.log(invoice["invoiceId"] );
            if(invoice["id"] === id){ 
                invoice["invoiceId"] = invoiceId;
                invoice["totalOpenAmount"] = amount;
                invoice["name"] = name;
                axios.post("http://localhost:8080/invoices", invoice)
                return null;
            }
            return null;
        })
    }
        setShow(false);
        setAmount(0)
        setId(0)
        setName("")
        setInvoiceId("")
    }

    const handleAdd = () => {
        setShow(true);
    }
    const BarStyling = {width:"100%",background:"#F2F1F9", border:"none", padding:"0.5rem"};
    const downloadStyling = {background:"grey", color: "white"}

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Invoice Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link onClick={handleAdd}>Add Invoice</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
            <CSVLink style={downloadStyling} {...csvReport}>Download Checked Invoice</CSVLink>
            <Container fluid>
                <Row>
                <Col sm = {10}>
                    <input 
                        style={BarStyling}
                        type="number"
                        value={input}
                        placeholder={"Search by Id"}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </Col>
                <Col>
                    <Button variant="primary" onClick={updateInput}>
                        <i className="fa fa-search" style={{"width": 150}}></i>
                    </Button>
                </Col>
                </Row>
            </Container>
            {currentInvoice["id"] ? <Table responsive>
                <thead>
                    <tr>
                        <th key={1}>Action</th>
                        <th>Id</th>
                        <th>Invoice Id</th>
                        <th>Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td key="1">
                            <input key={currentInvoice["id"]} onClick={() => handleCheckChieldElement(currentInvoice)} type="checkbox" value={currentInvoice["id"]} />
                            <i className="fa fa-pencil fa-lg" onClick= {() => handleEdit(currentInvoice)}></i>
                            <i className="fa fa-trash fa-lg" onClick = {() => handleDelete(currentInvoice["id"])}></i> 
                        </td>
                        <td>{currentInvoice["id"]}</td>
                        <td>{currentInvoice["invoiceId"]}</td>
                        <td>{currentInvoice["name"]}</td>
                        <td>{currentInvoice["totalOpenAmount"]}</td>
                    </tr>
                </tbody>
            </Table>
            : <Table responsive>
                <thead>
                    <tr>
                        <th key={1}>Action</th>
                        <th>Id</th>
                        <th>Invoice Id</th>
                        <th>Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => {
                        if(invoices.length === index + 1){
                            return ( 
                                <tr ref={lastInvoiceRef} key={index}>
                                    <td key={invoice["id"]}>
                                        <input key={invoice["id"]} onClick={() => handleCheckChieldElement(invoice)} type="checkbox" value={invoice["id"]} />
                                        <i className="fa fa-pencil fa-lg" onClick= {() => handleEdit(invoice)}></i>
                                        <i className="fa fa-trash fa-lg" onClick = {() => handleDelete(invoice["id"])}></i> 
                                    </td>
                                    {table.map((tableItem, index) => (
                                        <td key={index}> {invoice[tableItem]}</td>
                                    ))} 
                                </tr>
                            )
                        } else {
                            return(<tr key={index}>
                                <td key={invoice["id"]}>
                                    <input key={invoice["id"]} onClick={() => handleCheckChieldElement(invoice)} type="checkbox" value={invoice["id"]} />
                                    <i className="fa fa-pencil fa-lg" onClick= {() => handleEdit(invoice)}></i>{"\t"}
                                    <i className="fa fa-trash fa-lg" onClick = {() => handleDelete(invoice["id"])} ></i> 
                                </td>
                                {table.map((tableItem, index) => (
                                    <td key={index}> {invoice[tableItem]}</td>
                                ))} 
                            </tr>)
                        }
                    })}
                </tbody>
            </Table>}
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
                    <Form.Group controlId="formPlaintext">
                        <Form.Label>
                            Id
                        </Form.Label>
                        <Form.Control plaintext readOnly defaultValue={`\t${id}`} />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                    <Form.Label>Invoice Id</Form.Label>
                    <Form.Control type="number" value = {invoiceId} onChange = {(e) => setInvoiceId(e.target.value)} placeholder="Invoice Id" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange = {(e) => setName(e.target.value)} placeholder="Amount" />
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
        </>
    )
}

export default MiniHome;
