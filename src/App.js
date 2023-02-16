import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Aircrafts from './components/Aircrafts/Aircrafts';
import { useState } from 'react';


function App() {
  
  const [contentType, setContentType] = useState(1);
  
  const content = {
    1: <Aircrafts />
  }
  
  return (
    <div className='App'>
      <Container>
        <div className='nav-menu'>
          <Row className='g-0'>
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
