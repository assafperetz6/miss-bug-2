const { useState } = React

export function Login() {
    const [userCred, setUserCred] = useState()

    function handleSubmit(ev) {
        ev.preventDefault()

        console.log(userCred)
        
    }
    return (
        <div className="login-container">
            <h1>Miss Bug</h1>

            <section>
                <h2>Sign In</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" onChange={(ev) => setUserCred(prev => ({ ...prev, username: ev.target.value }))} />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={(ev) => setUserCred(prev => ({ ...prev, password: ev.target.value }))}/>

                    <button className="btn">Sign In</button>
                </form>
            </section>
        </div>
    )
}