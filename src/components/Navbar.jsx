import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">RCSS Map</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/">Map</Link></li>
                    <li><Link to="/products">Add Products</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar