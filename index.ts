import express from 'express';
import { Register, validateAuthBody } from './middleware/auth';

const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Ping Successfully!');
}
);

app.post('/v1/login', validateAuthBody, Register);

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));