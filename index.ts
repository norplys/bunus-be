import express from 'express';
import { validateRegisterBody, validateLogin } from './services/auth';
import { register, login } from './controller/auth';

const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Ping Successfully!');
}
);

app.post('/v1/register', validateRegisterBody, register);
app.post('/v1/login', validateLogin, login);

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));