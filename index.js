const express = require('express')

const app = express()

const jobCreator = require('./job-creator.js')

app.get('/', function(req, res) {
  res.send('Hello World!')
})

function fetchLatestVideos() {
    console.log('fetchLatestVideo '+Date.now())
}

const hourlyJob = jobCreator({onTick:fetchLatestVideos})

// cron job health
app.get('/cronjob', function(req, res) {
    res.json({
        running: hourlyJob.running
    })
})

const server = app.listen(3000, function() {
  const host = server.address().address
  const port = server.address().port

  hourlyJob.start()

  console.log(`Example app listening at 'http://${host}:${port}'`)
})
