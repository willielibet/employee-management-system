var connection = require('./employeesDBConnection')


const afterConnection = () => {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      console.log(res);
      //connection.end();
    });
  };

  afterConnection();