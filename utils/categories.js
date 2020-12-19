const mysql= require('mysql');

const conn = new mysql.createConnection(
    {
        host: 'localhost',
        user: 'hussain',
        password: '2010',
        database: 'classified-listing',
        multipleStatements: true
    } 
 );


 const getCategoryList=(callback)=>{
    const sql="select * from listing_categories;select * from listing_location";
    const query = conn.query(sql,[1,2],(err,results)=>{
        if(err)
        throw err;
        callback(results);
    })
 }

 module.exports=getCategoryList;