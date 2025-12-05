import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MobileNav.css';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="mobile-menu-button"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Menu */}
            <nav className={`mobile-nav ${isOpen ? 'open' : ''}`}>
                <div className="mobile-nav-header">
                    <h3>Menu</h3>
                    <p className="user-name">Welcome, {user?.name}</p>
                </div>

                <ul className="mobile-nav-links">
                    <li>
                        <Link
                            to="/dashboard"
                            className={isActive('/dashboard') ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">📊</span>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/income"
                            className={isActive('/income') ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">💰</span>
                            Income
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/transactions"
                            className={isActive('/transactions') ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">💸</span>
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/budgets"
                            className={isActive('/budgets') ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">📋</span>
                            Budgets
                        </Link>
                    </li>
                </ul>

                <button onClick={handleLogout} className="mobile-logout-btn">
                    <span className="nav-icon">🚪</span>
                    Logout
                </button>
            </nav>
        </>
    );
};

export default MobileNav;
