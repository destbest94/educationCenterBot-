const pool = require('../database/PgHelper')

async function getQuestions(){
    try{
        const {rows} = await pool.query(`SELECT * FROM questions ORDER BY id`)
        return rows;   
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    getQuestions: getQuestions
}