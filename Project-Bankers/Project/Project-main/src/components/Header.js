import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


function App() {

  const clearSession = () =>{
    sessionStorage.clear()
  }

  return (
    <>
      <Navbar bg="success" variant="dark">
        <Container>
          <Navbar.Brand href="/home">
            <img
              src="https://www.commercebank.com/-/media/cb/images/masthead/site-logo/cblogowhite00c2aa7d.svg?sc=1&revision=84c44cf4-c4cd-464b-af56-2daaa8047e21&modified=20200623220845&hash=AFDEDAFFA869FBDF36CA63F9C41DDE84"
              width="200"
              height="30"
              alt="commerce logo"
              className="d-flex flex-row-reverse"
            />
          </Navbar.Brand>
          <Nav className="p-2">
            <NavLink to="/balance" className="nav-link" activeClassName="active">
              Account Balance
            </NavLink>
            <NavLink to="/calendar" className="nav-link" activeClassName="active">
              Calendar View
            </NavLink>
            <NavLink to="/loan" className="nav-link" activeClassName="active">
              Loan Calculator
            </NavLink>
            <NavLink to="/login" className="nav-link" activeClassName="active" onClick={clearSession}>
              Log Out
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default App;
