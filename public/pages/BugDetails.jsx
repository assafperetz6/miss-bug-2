const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {
    const [bug, setBug] = useState(null)
    const [error, setError] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug', err)
                setError(err)
            })
    }, [])

    if (!bug) return <h1>{error}</h1>
    return bug && <div>
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <img src={`https://robohash.org/api/${bug._id}`} alt={`Bug ${bug._id}`} />
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.description && <p>Description: {bug.description}</p>}
        <Link to="/bug">Back to List</Link>
    </div>

}

