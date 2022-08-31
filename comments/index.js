const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()

const commentsByPostId = {}

app.use(bodyParser.json())
app.use(cors())

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex')
	const { content } = req.body
	const { id } = req.params

	const comments = commentsByPostId[id] || []

	comments.push({ id: commentId, content, status: 'pending' })

	commentsByPostId[id] = comments

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			postId: id,
			content,
			status: 'pending',
			id: commentId,
		},
	})

	res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
	console.log('Received Event', req.body.type)

	const { type, data } = req.body

	if (type === 'CommentModerated') {
		const { postId, id, status } = data

		const comment = commentsByPostId[postId].find((comment) => comment.id === id)
		comment.status = status

		await axios.post('http://localhost:4005/events', {
			type: 'CommentUpdated',
			data: {
				...data,
			},
		})
	}

	res.send({})
})

app.listen(4001, () => {
	console.log('Comments listening on post 4001')
})
