import * as express from 'express';
import * as dotenv from 'dotenv'
import { default as axios, Method } from 'axios';
dotenv.config();

const app = express();

const port = process.env.PORT || 8080

app.use(express.json())

app.all('*', async (req: express.Request, res: express.Response) => {
  try {
    const { originalUrl, method, body } = req;
    const [,recipient] = originalUrl.split('/')
    const recipientUrl = process.env[recipient];

    const requestUrl = `${recipientUrl}${originalUrl}`;

    if (!recipientUrl) {
      return res.status(502).end('Cannot process request')
    }

    const axiosConfig = {
      method: method as Method,
      url: requestUrl,
      ...(Object.keys(body || {}).length > 0 && { data: body })
    }

    try {
      const response = await axios(axiosConfig);
      return res.json(response.data);
    } catch (e) {
      console.log(e);
      const { status, data } = e.response;
      return res.status(status).json(data)
    }
  } catch (e) {
    res.status(502).end()
  }

})

app.listen(port, () => console.log('App starts on port ', port))


