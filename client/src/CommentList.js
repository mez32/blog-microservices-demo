import React from 'react'

const CommentList = ({ comments }) => {
	const renderedComments = comments.map((comment) => {
		return (
			<>
				{comment.status === 'approved' && <li key={comment.id}>{comment.content}</li>}
				{comment.status === 'rejected' && <li key={comment.id}>This comment has been rejected</li>}
				{comment.status === 'pending' && (
					<li key={comment.id}>This comment is awaiting moderation</li>
				)}
			</>
		)
	})

	return <ul>{renderedComments}</ul>
}

export default CommentList
