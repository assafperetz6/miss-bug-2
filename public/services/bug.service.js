import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'

export const bugService = {
	query,
	getById,
	save,
	remove,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
			.then(res => res.data)
			.catch((err) => {
				console.log('Problem getting bugs', err)
				throw err
			})
}

function getById(bugId) {
	return axios
		.get(BASE_URL + bugId)
		.then((res) => res.data)
		.catch((err) => {
			console.log('Problem getting bug', err.response) 
			throw err.response.data
		})
}

function remove(bugId) {
	return axios
		.delete(BASE_URL + bugId)
		.then((res) => res.data)
		.catch((err) => {
			console.log('Problem removing bug', err)
			throw err
		})
}

function save(bug) {    
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getDefaultFilter() {
	return { pageIdx: 0, txt: '', severity: 0, sortBy: { type: 'title', desc: 1 } }
}