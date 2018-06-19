const R = require('ramda')
const request = require('superagent')
const logger = require('debug')('fetch')
const assert = require('assert')

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/videos'
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

module.exports = async () => {
	const result = await request.get(YOUTUBE_API).query({
		maxResults: 30,
		regionCode: 'TW',
		chart: 'mostPopular',
		part: 'snippet,statistics',
		key: YOUTUBE_API_KEY
	})

	const items = result.body.items

	assert(R.is(Array, items), 'malformed response from youtube api')

	if (items.length < 30)
		logger('insufficient numbers of video from youtube api')

	return R.map(video => {
		return {
			id: R.path(['id'], video),
			title: R.path(['snippet', 'title'], video),
			description: R.path(['snippet', 'description'], video),
			views: R.path(['statistics', 'viewCount'], video),
			thumbnail: R.path(['snippet', 'thumbnails', 'default', 'url'], video)
		}
	})(items)
}
