var mysql = require("mysql");

var client = mysql.createConnection({
  user: "root",
  password: "fimysqlwid1!",
  database: "network_project1"
});


client.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }else{
        console.log("isConnection");
    }                                     // to avoid a hot loop, and to allow our node script to
});

module.exports = client;
