import { Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

const AppHeader = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <NavLink className="navbar-brand" to="/">Weather App</NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            to="/">Сейчас</NavLink>
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            to="/today">Сегодня</NavLink>
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            to="/tomorrow">Завтра</NavLink>
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            to="/week">Неделя</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppHeader;