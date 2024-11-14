const { NavLink, Link, useLocation } = ReactRouterDOM
const { useEffect } = React

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
    const loc = useLocation()
    console.log(loc.pathname)
    
    useEffect(() => {

    }, [])

    return (
        <header className='container'>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {loc.pathname !== '/login' &&
            <section className='auth-panel'>
                <h3>Hello Guest! Wanna <Link to="/login">Sign in?</Link></h3>
            </section>}
            <h1>Bugs are Forever</h1>
        </header>
    )
}
