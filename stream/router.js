const {Router} = require('express')
const Chatroom = require('./model')
const Sse = require('json-sse')


const router = new Router()
const stream = new Sse()

router.get('/stream', async (req, res) =>{
    console.log('got a request on /stream')

    // res.status(200)
    // res.send('it works')
    const messages = await Chatroom.findAll()
    const data = JSON.stringify(messages)
    console.log("stringified message:", data)

    stream.updateInit(data) // put data in the stream 
    stream.init(req,res) // important
})

router.post('/message', async (req, res) =>{
    console.log("got a request on /message", req.body)
    const {message} = req.body
    const entity = await Chatroom.create({
        message: message
    })



    const messages = await Chatroom.findAll()
    const data = JSON.stringify(messages)
    // console.log("stringified message:", data)
    stream.send(data)



    res.status(201)
    res.send('Thanks for your message')
})



module.exports = router