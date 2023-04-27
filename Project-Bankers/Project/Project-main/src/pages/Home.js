import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import './Home.css'
import AuthenticateUser from '../App.js'
import Header from '../components/Header'


function Home() {

  AuthenticateUser()

    const buttonStyle = {
        fontSize: '20px',
        width: "240px",
        height: "30px",
        color:"gray",
      };
      const headerStyle = {
        color:"green",
        textAlign: "center",
        paddingLeft: '65px',
      };
    return(
      <div><Header/>
        <div>
            <span className='yellow-dot'><span className='green-dot'></span></span>
            <h1 style={headerStyle}>How can we help?</h1>
            <br/>
        <Nav className="justify-content-center" defaultActiveKey="/home">
            <div className="flex-column" style={buttonStyle}>
        <Button variant="outline-secondary">
        <Nav.Item >
          <Nav.Link href="/balance"><div style={buttonStyle}>Balance View</div></Nav.Link>
        </Nav.Item >
        </Button>
        <Button variant="outline-secondary">
        <Nav.Item >
          <Nav.Link href="/calendar"><div style={buttonStyle}>Calendar View</div></Nav.Link>
        </Nav.Item>
        </Button>
        <Button variant="outline-secondary" >
        <Nav.Item >
          <Nav.Link href="/loan"><div style={buttonStyle}>Loan Calculator</div></Nav.Link>
        </Nav.Item>
        </Button>
        </div>
      </Nav>
      </div>
      </div>
    );
}

export default Home;