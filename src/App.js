import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Aircrafts from './components/Aircrafts/Aircrafts';
import { useState } from 'react';
import Passengers from './components/Passengers/Passengers';
import Reserves from './components/Reserves/Reserves';


function App() {
  
  const [contentType, setContentType] = useState(1);
  
  const content = {
    1: <Aircrafts />,
    2: <Passengers />,
    3: <Reserves />,
  }
  
  return (
    <div className='App'>
      <Container>
        <div className='nav-menu'>
          <Row className='g-1'>
            <Col>
              <div className='nav-item' onClick={() => setContentType(1)}>
                Aircrafts
              </div>
            </Col>
            <Col>
              <div className='nav-item' onClick={() => setContentType(2)}>
                Passengers
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='nav-item reserve-button'  onClick={() => setContentType(3)}>
                Reserve
              </div>
            </Col>
          </Row>
        </div>
        
        <div className='contents'>
          {
            content[contentType]
          }
        </div>
      </Container>
    </div>
  );
}

export default App;
