import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import userRouter from './routers/User.routes.js'
import ProductRoutes from './routers/Product.routes.js'
import ProductCategoriesRouter from './routers/ProductCategories.routes.js'
import StripeRouter from './routers/Stripe.routes.js'
import authRouter from './routers/Auth.routes.js'

const app = express()

//Conecta ao banco de dados
connectDB()

app.use(express.json())
app.use(cookieParser())

// Middleware para resolver erro CORS
app.use(cors({
    origin: process.env.HOST_URL, // Permitir solicitações do endereço indicado
    methods: ['GET', 'PUT', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Headers permitidos
    credentials: true, // Permitir credenciais (cookies, cabeçalhos de autenticação) nas solicitações
  }));

app.get('/', (req, res) => {
    res.status(200).json("SERVIDOR OK")
})

app.use('/user', userRouter)
app.use('/product', ProductRoutes)
app.use('/productCategories', ProductCategoriesRouter)
app.use('/stripe', StripeRouter)
app.use('/auth', authRouter)

export default app