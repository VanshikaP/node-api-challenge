require('dotenv').config();
const server = require('./server.js');

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`\n --- Server running on port ${port} --- \n`);
});

