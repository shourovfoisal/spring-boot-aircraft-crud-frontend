import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { apiPath } from '../../libs/apiPath';
import Aircraft from './Aircraft/Aircraft';
import './Aircrafts.css';

const Aircrafts = () => {
    
    const [aircrafts, setAircrafts] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    
    const [nameInput, setNameInput] = useState("");
    const [aircraftTypeInput, setAircraftTypeInput] = useState(null);
    
    const [aircraftTypeList, setAircraftTypeList] = useState([]);
    
    const getAircrafts = () => {
        
        fetch(`${apiPath()}/aircrafts`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setAircrafts(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }
    
    useEffect(() => {
        getAircrafts();
    }, [aircrafts])
    
    useEffect(() => {
        
        fetch(`${apiPath()}/aircraft-types`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setAircraftTypeList(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }, []);
    
    const handleAdd = () => {
        
        if(!aircraftTypeInput) {
            alert("Select aircraft type!");
            return;
        }
        
        const payload = {
            name: nameInput,
            aircraftType: {
                id: aircraftTypeInput
            }
        }
        
        fetch(`${apiPath()}/aircrafts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            setOpenAddModal(false)
            getAircrafts();
        })
        .catch(error => console.log('error', error));
    }
    
  return (
    <>
        <Modal show={openAddModal} onHide={() => setOpenAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Aircraft</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form>
                    <Form.Group 
                        className="mb-3" 
                        controlId="exampleForm.ControlInput1"
                    >
                        <Form.Label>Aircraft Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                    
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Aircraft Type</Form.Label>
                        <Form.Select 
                            onChange={(e) => setAircraftTypeInput(e.target.value)} 
                            aria-label="Aircraft Type Select"
                        >
                            <option>Select One</option>
                            {
                                aircraftTypeList.map((aType, idx) => 
                                    <option 
                                        key={idx} 
                                        value={aType.id}
                                    >
                                        {aType.name}
                                    </option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setOpenAddModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAdd}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    
        <div className='add-search-section'>
            <Row>
            <Col>
                <Button variant="success" onClick={() => setOpenAddModal(true)}>Add Aircraft</Button>
            </Col>
            <Col></Col>
        </Row>
        </div>
        
        <Table striped bordered hover variant="dark">
        <thead>
            <tr>
                <th className='fit'>#</th>
                <th>Name</th>
                <th>Type</th>
                <th className='fit'>Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                aircrafts.map((aircraft, idx) => <Aircraft getAircrafts={getAircrafts} key={idx} aircraft={aircraft} idx={idx} />)
            }
        </tbody>
    </Table>
    </>
  )
}

export default Aircrafts