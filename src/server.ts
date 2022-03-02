import express from 'express'
import { createConnection } from 'typeorm'
import { Article } from './entities/Article'
import { User } from './entities/User'
import { userRoute } from './routes/user'
import { usersRoute } from './routes/users'

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.use('/api/users', usersRoute)
app.use('/api/user', userRoute)

async function start() {
    await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "conduit",
        password: "Conduit@#85",
        database: "conduit",
        dropSchema: true,  //?to drop previous schema and implement new one
        entities: [Article,User],
        synchronize: true,
        logging: true,
        logger: "advanced-console"
    })

    app.listen(3232, () => {
        console.log("Server has started on http://localhost:3232")
    })
}
start().catch(err => console.error(err))

