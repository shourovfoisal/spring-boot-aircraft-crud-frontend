import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { apiPath } from '../../../libs/apiPath';

const Aircraft = ({aircraftTypes, getAircrafts, aircraft, idx}) => {
    
    const {name, aircraftType, id} = aircraft;
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    
    const [nameInput, setNameInput] = useState(name);
    const [aircraftTypeInput, setAircraftTypeInput] = useState(aircraftType.id);
    
    
    const handleUpdate = () => {
        
        if(nameInput === "") {
            alert("Enter name!");
            return;
        }
        
        const payload = {
            name: nameInput,
            aircraftType: {
                id: aircraftTypeInput
            }
        }
        
        fetch(`${apiPath()}/aircrafts/${id}`, {
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
            getAircrafts();
            
            setOpenUpdateModal(false);
        })
        .catch(error => console.log('error', error));
        
    }
    
    const handleDelete = () => {
        fetch(`${apiPath()}/aircrafts/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            getAircrafts();
            setOpenDeleteModal(false);
        })
        .catch(err => console.log(err));
    }
    
  return (
    <>
        <Modal show={openUpdateModal} onHide={() => setOpenUpdateModal(false)}>
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
                            {
                                aircraftTypes.map(aType => 
                                    <option 
                                        key={aType.id} 
                                        value={aType.id}
                                        selected={aType.id === aircraftType.id}
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
                <Modal.Title>Delete Aircraft</Modal.Title>
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
            <td>{aircraftType.name}</td>
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

export default Aircraft