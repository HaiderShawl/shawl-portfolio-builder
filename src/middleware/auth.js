const auth = (req, res, next) => {

    if (req.params.pass == "haider") {
        next()
    } else {
        res.status(401).send({ error: 'Access Denied' })
    }
}

module.exports = auth