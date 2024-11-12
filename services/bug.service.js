import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

const PAGE_SIZE = 4
const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}


function query(filterBy = { pageIdx: 0, txt: '', severity: 0, sortBy: { type: 'title', desc: 1 } }) {    
    var reqBugs = bugs
    // SS - Filter~
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        reqBugs = bugs.filter(bug => regex.test(bug.title))
    }
    
    if (filterBy.severity) {
        reqBugs = reqBugs.filter(bug => bug.severity > filterBy.severity)
    }
    
    // sort

    const sortBy = filterBy.sortBy
    if (sortBy.type === 'title') {
        reqBugs.sort((b1, b2) => (sortBy.desc) * (b1.title.localeCompare(b2.title)))
    }
    if (sortBy.type === 'createdAt') {
        reqBugs.sort((b1, b2) => (sortBy.desc) * (b1.createdAt - b2.createdAt))
    }
    if (sortBy.type === 'severity') {
        reqBugs.sort((b1, b2) => (sortBy.desc) * (b1.severity - b2.severity))
    }

    // Pagination
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        reqBugs = reqBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(reqBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {    
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugToSave.updatedAt = Date.now()
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}