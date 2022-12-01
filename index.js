// Add packages
require("dotenv").config();

// Add packages
const dblib = require("./dblib.js");

dblib.getTotalRecords()
    .then(result => {
        if (result.msg.substring(0, 5) === "Error") {
            console.log(`Error Encountered.  ${result.msg}`);
        } else {
            console.log(`Total number of database records: ${result.totRecords}`);
        };
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });
    
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.CRUNCHY_DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

const getAll =  () => {
    console.log("--- STEP 2: Inside getAll() ---");
    sql = "SELECT * FROM product";
    // For illustration, not using try catch
    return pool.query(sql, []); 
};


console.log("--- STEP 1: Before call to getAll() ---");
getAll()
    .then(result => {
        console.log("--- STEP 3: No Error ---");
        console.log(result);
    })
    .catch(err => {
        console.log("--- STEP 3: Error ---");
        console.log(err.message);
    });
console.log("--- STEP 4: After call to getAll() ---");

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM product";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

getTotalRecords()
    .then(result => {
        if (result.msg.substring(0, 5) === "Error") {
            console.log(`Error Encountered.  ${result.msg}`);
        } else {
            console.log(`Total number of database records: ${result.totRecords}`);
        };
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });

// Product array
const products = [
    {
        prod_id: 110,
        prod_name: 'Charger',
        prod_desc: 'USB',
        prod_price: 22.50
    },
    {
        prod_id: 200,
        prod_name: 'Book',
        prod_desc: 'The JS Way',
        prod_price: 9.99
    },
    {
        prod_id: 201,
        prod_name: 'Large Clips',
        prod_desc: 'Large binder clips',
        prod_price: 4.25
    },
    {
        prod_id: 202,
        prod_name: 'Medium Clips',
        prod_desc: 'Medium binder clips',
        prod_price: 3.25
    },
    {
        prod_id: 203,
        prod_name: 'Small Clips',
        prod_desc: 'Small binder clips',
        prod_price: 2.25
    }
];

// Declare variables
var numFailed = 0;
var numInserted = 0;
var errorMessage = "";

// Loop to insert - using async () function and await
// Not using try catch block
(async () => {
    console.log("--- STEP 1: Pre-Loop");
    for (prod of products) {
        console.log("--- STEP 2: In-Loop Before Insert");
        const result = await dblib.insertProduct(prod);
        console.log("--- STEP 3: In-Loop After Insert");
        console.log("result is: ", result);
        if (result.trans === "success") {
            numInserted++;
        } else {
            numFailed++;
            errorMessage += `${result.msg} \r\n`;
        };
    };    
    console.log("--- STEP 4: After-Loop");
    console.log(`Records processed: ${numInserted + numFailed}`);
    console.log(`Records successfully inserted: ${numInserted}`);
    console.log(`Records with insertion errors: ${numFailed}`);
    if(numFailed > 0) {
        console.log("Error Details:");
        console.log(errorMessage);
    };
})();
