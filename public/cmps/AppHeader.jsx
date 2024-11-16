const { NavLink, Link, useLocation } = ReactRouterDOM
const { useState, useEffect } = React

import { userService } from '../services/user.service.js'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
    const loc = useLocation()
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        setUser(userService.getLoggedInUser())
    }, [loc.pathname])

    function handleLogout() {
        userService.logout()
            .then(data => {
                setUser(null)
                console.log(data)
            })
    }

    return (
        <header className='container'>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {loc.pathname !== '/login' &&
            <section className='user-controls'>
                { user ?  <h3>Hello, {user.username}! Wanna <button className='btn' onClick={handleLogout}>log out?</button></h3>
                : <h3>Hello, Guest! Wanna <Link to="/login">Sign in?</Link></h3>}
            </section>}
            <h1>Bugs are Forever</h1>
        </header>
    )
}
