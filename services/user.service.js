import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'token1234')
const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    remove,

    save,
    checkLogin,
    logout,

    getLoggedinUser,
    getEmptyCredentials,
    getLoginToken,
    validateToken
}

function query() {
    return Promise.resolve(users)
}

function remove(userId) {
	users = users.filter(user => user._id !== userId)
	return _saveUsersToFile()
}

function checkLogin({ username, password }) {
	var user = users.find(user => user.username === username && user.password === password)
	if (user) {
		user = {
			_id: user._id,
			fullname: user.fullname,
			isAdmin: user.isAdmin,
		}
	}
	return Promise.resolve(user)
}

function save(user) {
    user._id = utilService.makeId()
    users.push(user)
        
    return _saveUsersToFile()
        .then(() => ({
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin,
        }))
}

function logout() {
    console.log('logout')
}

function getLoggedinUser() {
    console.log('getLoggedinUser')
}

function getEmptyCredentials() {
    console.log('getEmptyCredentials')
}

function getLoginToken(user) {
	const str = JSON.stringify(user)
	const encryptedStr = cryptr.encrypt(str)
	return encryptedStr
}

function validateToken(token) {
	if (!token) return null
    
	const str = cryptr.decrypt(token)
	const user = JSON.parse(str)
	return user
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}