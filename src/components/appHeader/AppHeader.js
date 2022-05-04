import { Container, Navbar, Nav } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const AppHeader = () => {
    return (
        // <Container>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Weather App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Now</Nav.Link>
                        <Nav.Link href="/today">Today</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        // </Container>
    )
}

export default AppHeader;