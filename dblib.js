// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.CRUNCHY_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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

module.exports.getTotalRecords = getTotalRecords;

const insertProduct = (product) => {
    // Will accept either a product array or product object
    if (product instanceof Array) {
        params = product;
    } else {
        params = Object.values(product);
    };

    const sql = `INSERT INTO product (prod_id, prod_name, prod_desc, prod_price)
                 VALUES ($1, $2, $3, $4)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success", 
                msg: `Product id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail", 
                msg: `Error on insert of product id ${params[0]}.  ${err.message}`
            };
        });
};

// Add this at the bottom
module.exports.insertProduct = insertProduct;