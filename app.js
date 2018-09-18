const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const morgan = require('morgan')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const Papa = require('papaparse')
const csvPath = path.join(__dirname, 'db', 'dataser.csv')
const options = {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
}
const csv = fs.readFileSync(csvPath, 'utf-8')
const listener = () => console.log(`Listening to port ${port}!`)
app.use(morgan('dev'))
app.disable('x-powered-by')
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    let {data} = Papa.parse(csv, options)
    console.log(data)
    res.send({data : data})
})

app.get('/:id', (req, res, next) => {
    let {data} = Papa.parse(csv, options)
    console.log(data)
    results = data.filter(matches => matches.ID === Number(req.params.id))
    console.log(results)
    if(results.length > 0){
        res.send({data:results})
    } else {
        next({message : 'No record found!'})
    }
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({error: err})
})

app.use((req, res, next) => {
    res.status(404).json({
        error: {message: 'Not Found!'}
    })
})
app.listen(port, listener)
