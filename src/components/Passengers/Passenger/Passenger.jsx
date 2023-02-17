import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { apiPath } from '../../../libs/apiPath';

const Passenger = ({genders, getPassengers, passenger, idx}) => {
    
    const {name, age, gender, id} = passenger;
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    
    const [nameInput, setNameInput] = useState(name);
    const [ageInput, setAgeInput] = useState(age);
    const [genderInput, setGenderInput] = useState(gender.id);
    
    const handleUpdate = () => {
        
        if(nameInput === "") {
            alert("Enter name!");
            return;
        }
        
        if(parseInt(ageInput) <= 0 || ageInput === "") {
            alert("Enter valid age!");
            return;
        }
        
        const payload = {
            name: nameInput,
            age: ageInput,
            gender: {
                id: genderInput
            }
        }
        
        fetch(`${apiPath()}/passengers/${id}`, {
            method: 'PUT',
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
            
            setOpenUpdateModal(false);
        })
        .catch(error => console.log('error', error));
        
    }
    
    const handleDelete = () => {
        fetch(`${apiPath()}/passengers/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            getPassengers();
            setOpenDeleteModal(false);
        })
        .catch(err => console.log(err));
    }
    
    return (
        <>
            <Modal show={openUpdateModal} onHide={() => setOpenUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Passenger</Modal.Title>
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
                                aria-label="Aircraft Type Select"
                            >
                                {
                                    genders.map(g => 
                                        <option 
                                            key={g.id} 
                                            value={g.id}
                                            selected={g.id === gender.id}
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
                    <Button variant="secondary" onClick={() => setOpenUpdateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={openDeleteModal} onHide={() => setOpenDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Passenger</Modal.Title>
                </Modal.Header>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpenDeleteModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <tr>
                <td>{idx+1}</td>
                <td>{name}</td>
                <td>{age}</td>
                <td>{gender.name}</td>
                <td>
                    <ButtonGroup>
                        <Button onClick={() => setOpenUpdateModal(true)} variant="primary" size='sm'>Update</Button>
                        <Button onClick={() => setOpenDeleteModal(true)} variant="danger" size='sm'>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        </>
    )
}

export default Passenger