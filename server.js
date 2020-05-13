const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.get('/', async(req, res) => {
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async(req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async(req, res) => {
    const short = await shortUrl.findOne({ short: req.params.shortUrl })
    if (!short) return res.sendStatus(404)
    
    short.clicks++
    short.save()
    res.redirect(short.full)
})

app.listen(process.env.PORT || 5000)