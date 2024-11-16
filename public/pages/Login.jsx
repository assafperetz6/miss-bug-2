import { userService } from "../services/user.service.js"

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function Login() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState()
    const navigate = useNavigate()

    function handleSubmit(ev) {
        ev.preventDefault()
        const serviceFn = isSignUp ? userService.signup : userService.login
    
        serviceFn(credentials)
        .then(data => {
            navigate('/bug')
        })
        .catch(err => console.log(err))

    }

    return (
        <div className="login-container">
            <h1>Miss Bug</h1>

            <section>
                <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" onChange={(ev) => setCredentials(prev => ({ ...prev, username: ev.target.value }))} />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={(ev) => setCredentials(prev => ({ ...prev, password: ev.target.value }))}/>

                    <button className="btn">Sign {isSignUp ? 'up' : 'in'}</button>
                </form>

                <h4>{isSignUp ? `Already` : `Don't`} have an account? <button className="btn" onClick={() => setIsSignUp(prev => prev = !prev)}>Sign {isSignUp ? 'in' : 'up'}!</button></h4>
            </section>
        </div>
    )
}