const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) return res.sendStatus(401)

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		// req.userId = decoded.id
		// userID: userID, username: username, permission: permission, accountBalance: accountBalance, accountNumber: accountNumber
		req.userID = decoded.userID;
		req.username = decoded.username;
		req.permission = decoded.permission;
		req.accountBalance = decoded.accountBalance;
		req.accountNumber = decoded.accountNumber;
		next()
	} catch (error) {
		console.log(error)
		return res.sendStatus(403)
	}
}

module.exports = verifyToken