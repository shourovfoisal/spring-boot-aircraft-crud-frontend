import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Reserve from './Reserve/Reserve';
import { apiPath } from '../../libs/apiPath';
import DatePicker from 'react-date-picker';
import moment from 'moment';

const Reserves = () => {
  
  const [openAddModal, setOpenAddModal] = useState(false);
  const [passengerInput, setPassengerInput] = useState(0);
  const [aircraftInput, setAircraftInput] = useState(0);
  const [dateOfFlyInput, setDateOfFlyInput] = useState(new Date());
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  
  const [nameSearchInput, setNameSearchInput] = useState("");
  const [aircraftTypeSearchInput, setAircraftTypeSearchInput] = useState(0);
  
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [reserves, setReserves] = useState([]);
  
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
  
  const getPassengers = () => {
      
    fetch(`${apiPath()}/passengers`, {
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
  
  const getReserves = (param="") => {
        
        fetch(`${apiPath()}/reserves${param === "?" ? "" : param}`, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            setReserves(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
  
  useEffect(() => {
      getReserves();
      getAircraftTypes();
      getAircrafts();
      getPassengers();
  }, []);
  
  const handleAdd = () => {
        
    if(!passengerInput) {
        alert("Select passenger!");
        return;
    }
    
    if(!aircraftInput) {
        alert("Select aircraft!");
        return;
    }
    
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
    
    fetch(`${apiPath()}/reserves`, {
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
        getReserves();
        
        setOpenAddModal(false);
        setPassengerInput(0);
        setAircraftInput(0);
        setDateOfFlyInput(new Date());
        setSourceInput("");
        setDestinationInput("");
    })
    .catch(error => console.log('error', error));
  }
  
  const reserveSearch = () => {
        
    const searchTerm1 = nameSearchInput;
    const searchTerm2 = parseInt(aircraftTypeSearchInput);
    
    let param = "?";
    
    if(searchTerm1 !== "") {
        param += `passenger_name=${searchTerm1}`;
    }
    
    if(searchTerm2 !== 0 && searchTerm1 !== "") {
        param += `&aircraft_type_id=${searchTerm2}`;
    } else if(searchTerm2 !== 0 && searchTerm1 === "") {
        param += `aircraft_type_id=${searchTerm2}`;
    }

    getReserves(param);
  }

  return (
    <>
      <Modal show={openAddModal} onHide={() => setOpenAddModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Add Reservation</Modal.Title>
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
                          <option>Select One</option>
                          {
                              passengers.map(p => 
                                  <option 
                                      key={p.id} 
                                      value={p.id}
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
                          <option>Select One</option>
                          {
                              aircrafts.map(a => 
                                  <option 
                                      key={a.id} 
                                      value={a.id}
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
                <Button variant="success" onClick={() => setOpenAddModal(true)}>Add Reservation</Button>
            </Col>
            <Col>
                <Row className='g-2'>
                    <Col>
                        <Form.Control
                            type="text"
                            value={nameSearchInput}
                            placeholder="Search by Passenger Name"
                            onChange={(e) => setNameSearchInput(e.target.value)}
                            autoFocus
                        />
                    </Col>
                    <Col style={{display: "flex", gap: "0.5rem"}}>
                        <Form.Select 
                            onChange={(e) => setAircraftTypeSearchInput(e.target.value)} 
                            aria-label="Aircraft Type Select"
                        >
                            <option selected value="0">All Aircraft Types</option>
                            {
                                aircraftTypes.map(at => 
                                    <option 
                                        key={at.id} 
                                        value={at.id}
                                    >
                                        {at.name}
                                    </option>
                                )
                            }
                        </Form.Select>
                        <Button variant='warning' onClick={reserveSearch}>Search</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
      </div>
    
      <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th className='fit'>#</th>
                    <th>Aircraft</th>
                    <th>Passenger</th>
                    <th>Date of Fly</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th className='fit'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    reserves.map((reserve, idx) => 
                        <Reserve 
                            aircrafts={aircrafts}
                            passengers={passengers}
                            getReserves={getReserves} 
                            key={reserve.id} 
                            reserve={reserve} 
                            idx={idx}
                        />
                    )
                }
            </tbody>
        </Table>
    </>
  )
}

export default Reserves