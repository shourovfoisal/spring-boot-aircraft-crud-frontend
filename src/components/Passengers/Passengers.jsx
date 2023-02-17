import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { apiPath } from '../../libs/apiPath';
import Passenger from './Passenger/Passenger';
import './Passengers.css';

const Passengers = () => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [ageInput, setAgeInput] = useState(0);
    const [genderInput, setGenderInput] = useState(0);
    
    const [nameSearchInput, setNameSearchInput] = useState("");
    const [genderSearchInput, setGenderSearchInput] = useState(0);
    
    const [passengers, setPassengers] = useState([]);
    const [genders, setGenders] = useState([]);
    
    const getPassengers = (param="") => {
        
        fetch(`${apiPath()}/passengers${param === "?" ? "" : param}`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setPassengers(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    const getGenders = () => {
        fetch(`${apiPath()}/genders`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setGenders(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    useEffect(() => {
        getPassengers();
        getGenders();
    }, [])
    
    const handleAdd = () => {
        
        if(nameInput === "") {
            alert("Enter name!");
            return;
        }
        
        if(parseInt(ageInput) <= 0 || ageInput === "") {
            alert("Enter valid age!");
            return;
        }
        
        if(!genderInput) {
            alert("Select gender!");
            return;
        }
        
        const payload = {
            name: nameInput,
            age: ageInput,
            gender: {
                id: genderInput
            }
        }
        
        fetch(`${apiPath()}/passengers`, {
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
            getPassengers();
            
            setOpenAddModal(false);
            setNameInput("");
            setGenderInput(0);
        })
        .catch(error => console.log('error', error));
    }
    
    const passengerSearch = () => {
        
        const searchTerm1 = nameSearchInput;
        const searchTerm2 = parseInt(genderSearchInput);
        
        let param = "?";
        
        if(searchTerm1 !== "") {
            param += `name=${searchTerm1}`;
        }
        
        if(searchTerm2 !== 0 && searchTerm1 !== "") {
            param += `&gender_id=${searchTerm2}`;
        } else if(searchTerm2 !== 0 && searchTerm1 === "") {
            param += `gender_id=${searchTerm2}`;
        }

        getPassengers(param);
    }
    
  return (
    <>
        <Modal show={openAddModal} onHide={() => setOpenAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Passenger</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form>
                    <Form.Group 
                        className="mb-3" 
                        controlId="exampleForm.ControlInput1"
                    >
                        <Form.Label>Passenger Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                    
                    <Form.Group 
                        className="mb-3" 
                        controlId="exampleForm.ControlInput2"
                    >
                        <Form.Label>Passenger Age</Form.Label>
                        <Form.Control
                            type="number"
                            value={ageInput}
                            onChange={(e) => setAgeInput(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Gender</Form.Label>
                        <Form.Select 
                            onChange={(e) => setGenderInput(e.target.value)} 
                            aria-label="Gender Select"
                        >
                            <option>Select One</option>
                            {
                                genders.map(g => 
                                    <option 
                                        key={g.id} 
                                        value={g.id}
                                    >
                                        {g.name}
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
                    <Button variant="success" onClick={() => setOpenAddModal(true)}>Add Passenger</Button>
                </Col>
                <Col>
                    <Row className='g-2'>
                        <Col>
                            <Form.Control
                                type="text"
                                value={nameSearchInput}
                                placeholder="Search by name"
                                onChange={(e) => setNameSearchInput(e.target.value)}
                                autoFocus
                            />
                        </Col>
                        <Col style={{display: "flex", gap: "0.5rem"}}>
                            <Form.Select 
                                onChange={(e) => setGenderSearchInput(e.target.value)} 
                                aria-label="Gender Select"
                            >
                                <option selected value="0">All Genders</option>
                                {
                                    genders.map(g => 
                                        <option 
                                            key={g.id} 
                                            value={g.id}
                                        >
                                            {g.name}
                                        </option>
                                    )
                                }
                            </Form.Select>
                            <Button variant='warning' onClick={passengerSearch}>Search</Button>
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
                    <th>Age</th>
                    <th>Gender</th>
                    <th className='fit'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    passengers.map((passenger, idx) => 
                        <Passenger 
                            genders={genders} 
                            getPassengers={getPassengers} 
                            key={passenger.id} 
                            passenger={passenger} 
                            idx={idx}
                        />
                    )
                }
            </tbody>
        </Table>
    </>
  )
}

export default Passengers