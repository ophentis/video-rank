const express = require('express')
const logger = require('debug')('app')
const db = require('./db.js')

const app = express()

const jobCreator = require('./job-creator.js')

app.get('/', function(req, res) {
	res.send('Hello World!')
})

const fetchLatestVideos = require('./fetch.js')

const hourlyJob = jobCreator({
	onTick: async () => {
		const list = await fetchLatestVideos()
		logger(list)
		db.updateTopRated(Date.now(), list)
	}
})

app.get('/top-rated', function(req, res) {

	const date = req.query.date
	if( !date ) {
		res.status(400)
		res.json({error: 'date not specified in query. example ?date=2018012018'})
		return
	}
	const dateMatch = date.match(/^(\d{4})(\d{2})(\d{2})(\d{2})$/)
	if( !dateMatch ) {
		res.status(400)
		res.json({error: 'date format not matching yyyymmddhh. example ?date=2018012018'})
		return
	}
	const time = new Date(dateMatch[1], dateMatch[2]-1, dateMatch[3], dateMatch[4]).getTime()

	let size = req.query.size|0 || 30
	size = Math.max(size, 0)
	size = Math.min(size, 30)

	const list = db.getTopRated(time)

	if( !list ) {
		res.status(400)
		res.json({error: 'record not found'})
		return
	}
	res.json(list.slice(0, size))
})

// cron job health
app.get('/cronjob', function(req, res) {
	res.json({
		running: hourlyJob.running,
		lastDate: hourlyJob.lastDate(),
		nextDates: hourlyJob.nextDates()
	})
})

const server = app.listen(3000, async function() {
	const host = server.address().address
	const port = server.address().port

	hourlyJob.start()

	console.log(`App listening at 'http://${host}:${port}'`)
})
