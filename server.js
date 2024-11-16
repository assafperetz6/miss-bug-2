import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

function manageVisitedBugs(req, res, next) {
	const { bugId } = req.params
	let visitedBugs = req.cookies.visitedBugs || []

	if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

	if (visitedBugs.length > 3) {
		loggerService.error('User has viewed more than 3 bugs', visitedBugs)
		res.status(401).send('Wait a minute...')
		return
	}

	res.cookie('visitedBugs', visitedBugs, { maxAge: 70000 })

	next()
}

function checkPermissions(req, res, next) {
	const { loginToken } = req.cookies
	const loggedinUser = userService.validateToken(loginToken)

	if (!loggedinUser) return res.status(401).send('Cannot delete bug')
	else next()
}

//* Express Routing:
app.get('/api/bug', (req, res) => {
	const filterBy = {
		pageIdx: +req.query.pageIdx,
		txt: req.query.txt || '',
		severity: +req.query.severity || 0,
		labels: req.query.labels || '',
		sortBy: JSON.parse(req.query.sortBy),
	}

	bugService
		.query(filterBy)
		.then((bugs) => res.send(bugs))
		.catch((err) => {
			loggerService.error('Cannot get bugs', err)
			res.status(500).send('Cannot get bugs')
		})
})

app.post('/api/bug', (req, res) => {
	const bugToSave = req.body

	bugService
		.save(bugToSave)
		.then((savedBug) => res.send(savedBug))
		.catch((err) => {
			loggerService.error('Cannot add bug', err)
			res.status(400).send('Cannot add bug', err)
		})
})

app.put('/api/bug/:bugId', (req, res) => {
	const bugToSave = req.body

	bugService
		.save(bugToSave)
		.then((savedBug) => res.send(savedBug))
		.catch((err) => {
			loggerService.error('Cannot update bug', err)
			res.status(400).send('Cannot update bug', err)
		})
})

app.get('/api/bug/:bugId', manageVisitedBugs, (req, res) => {
	const { bugId } = req.params
	bugService
		.getById(bugId)
		.then((bug) => res.send(bug))
		.catch((err) => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

app.delete('/api/bug/:bugId', checkPermissions, (req, res) => {		
	const { bugId } = req.params
	bugService
		.remove(bugId)
		.then(() => res.send(bugId + ' Removed Successfully!'))
		.catch((err) => {
			loggerService.error('Cannot remove bug', err)
			res.status(500).send('Cannot remove bug')
		})
})

// User API

app.get('/api/logs', (req, res) => {
	const path = process.cwd()
	res.sendFile(path + '/logs/backend.log')
})

app.get('/api/user', (req, res) => {
	userService
		.query()
		.then((users) => res.send(users))
		.catch((err) => {
			loggerService.error('problem getting users:', err)
			console.log('problem getting users:', err)
		})
})

app.delete('/api/user/:userId', (req, res) => {
	const { userId } = req.params
	userService
		.remove(userId)
		.then((user) => res.send(`User ${user._id} removed successfully`))
		.catch((err) => {
			loggerService.error('Could not remove user', userId, 'Error: ', err)
			res.status(500).send(err)
		})
})

app.post('/api/auth/signup', (req, res) => {
	const credentials = req.body
	userService.save(credentials).then((user) => {
		if (user) {
			const loginToken = userService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		} else {
			res.status(400).send('Cannot signup')
		}
	})
})

app.post('/api/auth/login', (req, res) => {
	const credentials = req.body

	userService.checkLogin(credentials).then((user) => {
		if (user) {
			const loginToken = userService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		} else {
			res.status(404).send('Invalid Credentials')
		}
	})
})

app.post('/api/auth/logout', (req, res) => {
	res.clearCookie('loginToken')
	res.send('logged-out!')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3031
app.listen(PORT, () =>
	loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
