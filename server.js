if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

mongoose.connect(process.env.DB_URL, {
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

app.delete('/shortUrls/:id', async(req, res) => {
    let urlToDelete
    try {
          urlToDelete = await shortUrl.findById(req.params.id)
          await urlToDelete.remove()
          res.redirect('/')
    } catch (error) {
        res.sendStatus(404)
    }
})

app.get('/:shortUrl', async(req, res) => {
    const short = await shortUrl.findOne({ short: req.params.shortUrl })
    if (!short) return res.sendStatus(404)
    
    short.clicks++
    short.save()
    res.redirect(short.full)
})
app.listen(process.env.PORT || 5000)