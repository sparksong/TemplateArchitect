const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
/* const templateRouter = require('./routes/templateRouter'); */

app.use(express.static('server/public'));

/* app.use('/template', templateRouter); */

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
});
