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
    const [aircraftTypeInput, setAircraftTypeInput] = useState(0);
    const [aircraftTypeSearchInput, setAircraftTypeSearchInput] = useState(0);
    
    const [aircraftTypes, setAircraftTypes] = useState([]);
    
    const getAircrafts = (param="") => {
        
        fetch(`${apiPath()}/aircrafts${param === "?" ? "" : param}`, {
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
    
    const getAircraftTypes = () => {
        fetch(`${apiPath()}/aircraft-types`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setAircraftTypes(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    useEffect(() => {
        getAircraftTypes();
        getAircrafts();
    }, []);
    
    const aircraftSearch = () => {
        
        const searchTerm = parseInt(aircraftTypeSearchInput);
        
        let param = "?";
        
        if(searchTerm !== 0) {
            param += `type_id=${searchTerm}`;
        }
        
        // let param = searchTerm !== 0 ? `?type_id=${searchTerm}` : "";
        getAircrafts(param);
    }
    
    const handleAdd = () => {
        
        if(nameInput === "") {
            alert("Enter name!");
            return;
        }
        
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
            getAircrafts();
            
            setOpenAddModal(false);
            setNameInput("");
            setAircraftTypeInput(0);
        })
        .catch(error => console.log('error', error));
    }
    
  return (
    <>
        <Modal show={openAddModal} onHide={() => setOpenAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Aircraft</Modal.Title>
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
                                aircraftTypes.map(aType => 
                                    <option 
                                        key={aType.id} 
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
            <Col>
                <Row>
                    <Col></Col>
                    <Col style={{display: "flex", gap: "0.5rem"}}>
                        <Form.Select 
                            onChange={(e) => setAircraftTypeSearchInput(e.target.value)} 
                            aria-label="Aircraft Type Select"
                        >
                            <option selected value="0">All Types</option>
                            {
                                aircraftTypes.map(aType => 
                                    <option 
                                        key={aType.id} 
                                        value={aType.id}
                                    >
                                        {aType.name}
                                    </option>
                                )
                            }
                        </Form.Select>
                        <Button variant='warning' onClick={aircraftSearch}>Search</Button>
                    </Col>
                </Row>
            </Col>
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
                    aircrafts.map((aircraft, idx) => 
                        <Aircraft 
                            aircraftTypes={aircraftTypes} 
                            getAircrafts={getAircrafts} 
                            key={aircraft.id} 
                            aircraft={aircraft} 
                            idx={idx} 
                        />
                    )
                }
            </tbody>
        </Table>
    </>
  )
}

export default Aircrafts