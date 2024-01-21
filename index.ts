import express from 'express';
import { validateRegisterBody, validateLogin, validateJwt } from './services/auth';
import { register, login, getMe } from './controller/auth';

const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Ping Successfully!');
}
);

app.post('/v1/register', validateRegisterBody, register);
app.post('/v1/login', validateLogin, login);
app.get('/v1/get-me', validateJwt, getMe);



app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));