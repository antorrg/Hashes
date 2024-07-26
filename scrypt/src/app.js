import express from 'express'
import morgan from 'morgan'
import router from './router.js'

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use(router)

app.listen(3000, ()=>{
    console.log(`Server is listeninig in app scrypt in http://localhost:3000`)
})