import express from 'express'

const app = express();

app.get('/',(req,res) => {
    res.send('Hallo World by using express framework')
})

app.listen(3001, () => {
    console.log('Server is running at port 3001');
})

