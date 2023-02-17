import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { apiPath } from '../../../libs/apiPath';

const Reserve = ({ aircrafts, passengers, getReserves, reserve, idx }) => {
  
  const { aircraft, passenger, dateOfFly, source, destination, id } = reserve;
  
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  
  const [passengerInput, setPassengerInput] = useState(passenger.id);
  const [aircraftInput, setAircraftInput] = useState(aircraft.id);
  const [dateOfFlyInput, setDateOfFlyInput] = useState(new Date(dateOfFly));
  const [sourceInput, setSourceInput] = useState(source);
  const [destinationInput, setDestinationInput] = useState(destination);
  
  const handleUpdate = () => {
    
    if(sourceInput === "") {
        alert("Enter source!");
        return;
    }
    
    if(destinationInput === "") {
        alert("Enter destination!");
        return;
    }
        
    const payload = {
    passenger: {
        id: passengerInput
    },
    aircraft: {
        id: aircraftInput
    },
    dateOfFly: moment(dateOfFlyInput).format("YYYY-MM-DD"),
    source: sourceInput,
    destination: destinationInput
    }
    
    fetch(`${apiPath()}/reserves/${id}`, {
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
        getReserves();
        
        setOpenUpdateModal(false);
    })
    .catch(error => console.log('error', error));
      
  }
    
  const handleDelete = () => {
      fetch(`${apiPath()}/reserves/${id}`, {
          method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
          console.log(data);
          getReserves();
          setOpenDeleteModal(false);
      })
      .catch(err => console.log(err));
  }
  
  return (
    <>
      <Modal show={openUpdateModal} onHide={() => setOpenUpdateModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Edit Reservation</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
              <Form>
                  <Form.Group 
                      className="mb-3" 
                      controlId="exampleForm.ControlInput1"
                  >
                      <Form.Label>Passenger</Form.Label>
                      <Form.Select 
                          autoFocus
                          onChange={(e) => setPassengerInput(e.target.value)} 
                          aria-label="Passenger Select"
                      >
                          {
                              passengers.map(p => 
                                  <option 
                                      key={p.id} 
                                      value={p.id}
                                      selected={p.id === passenger.id}
                                  >
                                      {p.name}
                                  </option>
                              )
                          }
                      </Form.Select>
                  </Form.Group>
                  
                  <Form.Group 
                      className="mb-3" 
                      controlId="exampleForm.ControlInput2"
                  >
                      <Form.Label>Aircraft</Form.Label>
                      <Form.Select 
                          onChange={(e) => setAircraftInput(e.target.value)} 
                          aria-label="Aircraft Select"
                      >
                          {
                              aircrafts.map(a => 
                                  <option 
                                      key={a.id} 
                                      value={a.id}
                                      selected={a.id === aircraft.id}
                                  >
                                      {a.name}
                                  </option>
                              )
                          }
                      </Form.Select>
                  </Form.Group>
                  
                  <Form.Group 
                      className="mb-3" 
                      controlId="exampleForm.ControlInput3"
                  >
                      <Form.Label style={{marginRight: "0.7rem"}}>Date of Fly</Form.Label>
                      <DatePicker clearIcon={null} onChange={(e) => setDateOfFlyInput(e)} value={dateOfFlyInput} />
                  </Form.Group>
                  
                  <Form.Group 
                      className="mb-3" 
                      controlId="exampleForm.ControlInput4"
                  >
                      <Form.Label>Source</Form.Label>
                      <Form.Control
                          type="text"
                          value={sourceInput}
                          onChange={(e) => setSourceInput(e.target.value)}
                      />
                  </Form.Group>
                  
                  <Form.Group 
                      className="mb-3" 
                      controlId="exampleForm.ControlInput5"
                  >
                      <Form.Label>Destination</Form.Label>
                      <Form.Control
                          type="text"
                          value={destinationInput}
                          onChange={(e) => setDestinationInput(e.target.value)}
                      />
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
              <Modal.Title>Delete Reserve</Modal.Title>
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
          <td>{aircraft.name}</td>
          <td>{passenger.name}</td>
          <td>{moment(dateOfFly).format("MMMM D, YYYY")}</td>
          <td>{source}</td>
          <td>{destination}</td>
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

export default Reserve