const express = require('express')

const app = express()

const jobCreator = require('./job-creator.js')

app.get('/', function(req, res) {
	res.send('Hello World!')
})

const fetchLatestVideos = require('./fetch.js')

const hourlyJob = jobCreator({
	onTick: async () => {
		const list = await fetchLatestVideos()
		console.log(list)
	}
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
