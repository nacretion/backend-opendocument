const app = require ("./app");
const {PORT} = require("./config");

app.listen(PORT, () => console.log("started successfully on port", PORT))