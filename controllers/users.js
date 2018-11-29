const pool = require('../database/PgHelper')
const Constants = require('../constants')

async function setNewUser(from){
    var queryText = `INSERT INTO users (id, first_name, last_name, username, phone, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    try{
        const { rows } = await pool.query(queryText, [from.id, from.first_name, from.last_name, from.username, from.phone, from.language])
        return rows[0]
    }catch(err){
        if(err.code === '23505'){
            queryText = `SELECT * FROM users where id = '${from.id}'`
            try{
                const {rows} = await pool.query(queryText);
                return rows[0]
            }catch(err){
                console.log(err)
                throw err
            }
        }
        console.log(err)
        throw err
    }
}

async function setLanguage(id, language){
    const queryText = `UPDATE users SET language = '${language}' WHERE id = '${id}'`
    try{
        await pool.query(queryText)
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

async function setPhone(id, phone){
    const queryText = `UPDATE users SET phone = '${phone}' WHERE id = '${id}'`
    try{
        await pool.query(queryText)
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

async function setMessage(user_id, arg){
    const queryText = `UPDATE users SET user_status = '${arg}' WHERE id = '${user_id}'`
    try{
        await pool.query(queryText)
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

async function getLanguage(arg){
    if(typeof arg === "number"){
        try{
            const {rows} = await pool.query(`SELECT language FROM users where id = '${arg}'`)
            arg = rows[0].language   
        }catch(err){
            console.log(err)
            return false
        }
    }
    switch(arg){
        case Constants.UZ: return Constants.UZB; break
        case Constants.EN: return Constants.ENG; break
        case Constants.RU: return Constants.RUS; break
    }
}

async function getUser(user_id){
    try{
        const {rows} = await pool.query(`SELECT * FROM users where id = '${user_id}'`)
        return rows[0]
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    setNewUser: setNewUser,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    getUser: getUser,
    setPhone: setPhone,
    setMessage: setMessage
}