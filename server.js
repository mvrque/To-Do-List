//npm init
//npm install express --save
//npm install nodemon --save-dev = refresh browser automaticly without restarting the server manually
// adding 'dev' : 'nodemon server.js' to package.json file
//npm install body-parser --save = it is  a middleware to tidy up the request object
//npm install mongodb --save
//npm install ejs --save

//-----------------------------------------------------------------------------


const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://mvrque:smokeweed123@cluster0.pv9ll.mongodb.net/?retryWrites=true&w=majority'




MongoClient.connect(connectionString, {
    useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to a DATABASE')
        db = client.db('To-Do-List')
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
    
    

//get request to the server to perfom READ operation
app.get('/', async (req, res) => {
    const toDoItems = await db.collection('tasks').find().toArray()
    const itemsLeft = await db.collection('tasks').countDocuments({completed: false})
    //res.render('index.ejs', {items: toDoItems, left: itemsLeft })

    db.collection('tasks').find().toArray() //
    
    .then(data => {
        db.collection('tasks').countDocuments({completed: false})
        .then(itemsLeft => {
            res.render('index.ejs', {items: data, left: itemsLeft}) 
            
        })
    })
    .catch(error => console.error(error))
})


app.post('/addTasks', (req, res) => {
    db.collection('tasks').insertOne({taskname: req.body.toDoItem, completed: false})
    .then(result => {
        console.log('todo added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (req, res) => {
    db.collection('tasks').updateOne({taskname: req.body.itemFromJS},{
        $set: {
            completed:true
        }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Completete')
        res.json('Marked complete')
    })
    .catch(error => console.error(error))
})

app.put('/markUnComplete', (req, res) => {
    db.collection('tasks').updateOne({taskname: req.body.itemFromJS},{
        $set: {
            completed:false
        }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnCompletete')
        res.json('Marked UnComplete')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteItem', (req, res) => {
    db.collection('tasks').deleteOne({taskname: req.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        res.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

    




app.listen(3000, function () {
    console.log('Server is running on 3000. GO CATCH IT!')
})