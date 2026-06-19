import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Routes
app.use('/', routes);

export default app;