const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
/* const templateRouter = require('./routes/templateRouter'); */

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/* app.use('/template', templateRouter); */

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
});
