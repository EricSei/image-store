import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Navbar({ title, icon }) {
	return (
		<div className="navbar bg-success">
			<h2>
				<i className={icon} /> {title}
			</h2>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/signup">Sign Up</Link>
				</li>
				<li>
					<Link to="/signin">Sign In</Link>
				</li>
			</ul>
		</div>
	)
}

Navbar.prototype = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string
}

Navbar.defaultProps = {
	title: "Im@geUplo@der",
	icon: "fas fa-images fa-lg"
}
export default Navbar
