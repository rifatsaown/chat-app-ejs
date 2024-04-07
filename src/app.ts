import cokkieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import routes from './app/routes';
import configs from './configs';
import globalErrorHandler from './errors/globalErrorHandler';
import dbConnect from './utils/dbConnect';

const app:Application = express();
// cors
app.use(cors())

// Connect to MongoDB 
dbConnect();

// Set EJS as the view engine
app.set('view engine', 'ejs')
// Set the path to the views directory
app.set('views', path.join(__dirname, '../views'))

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cokkieParser(configs.cookieSecret))
app.use(express.static(path.join(__dirname, '../public')))

// Application routes
app.use('/', routes)


//Welcome route
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.render('welcome' , {port : configs.port})
})

// 404 route
app.use((req: Request, res: Response, next: NextFunction) => {
    if (res.locals.html) {
        res.status(404).render('error', { title: 'Error', statusCode: 404, message: 'Page not found', errorSources: [] })
    }
    else {
        res.status(404).json({ message: 'Page not found' })
    }
})


// Error handling
app.use(globalErrorHandler)

export default app;