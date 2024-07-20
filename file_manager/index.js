/*this is  the express application the entry point*/
import express from 'express';
import dotenv from 'dotenv';
import appRoutes from './routes/appRoutes';
import i18n from './config/i18n';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(i18n);
app.use(express.json());
app.use('/api', appRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
