const server=require('./server')
const port = process.env.PORT || 6000
const startServer = ()=>{
    server.listen(port, ()=>{
        console.log(`Server running on port ${port}`)
    })
}
startServer()