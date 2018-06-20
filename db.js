const db = {}

// turn time stamp of the closest hour earlier than the time
function _closestHour(time) {
	return ((time/1000)|0) - (((time/1000)|0)%(60*60))
}

// update top rated list with given time
function updateTopRated(time, list) {
	const index = _closestHour(time)
	db[index] = list
}

// get top rated list with given time, may be undefine
function getTopRated(time) {
	const index = _closestHour(time)
	return db[index]
}

module.exports = {
	getTopRated,
	updateTopRated
}
