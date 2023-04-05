import express from 'express';

const app = express();

//GET - info päring
//POST - saadan infot, 
//PUT
//DELETE
app.get('/api', (req, res) =>{
    //output APIdoc page
    res.end("Hello");
});

export default app;