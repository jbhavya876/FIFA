import React from 'react'
import { NavLink } from 'react-router-dom';

const activeClassName = 'active'

const CustomNavLink = (props) => {
    const { to, text } = props;

    return (
        <li className="nav-item">
            <NavLink to={to} activeClassName={activeClassName} className="nav-link">
                {text}
            </NavLink>
        </li>
    );
}

export default CustomNavLink;