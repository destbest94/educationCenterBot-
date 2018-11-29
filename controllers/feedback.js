const pool = require('../database/PgHelper')

async function setNewMessage(ctx) {
    const query_text = "INSERT INTO feedback (user_id, create_at, message, red) VALUES ($1, $2, $3, $4)"
    const user_id = ctx.message.from.id
    const time = ctx.message.date
    const message = ctx.message.text
    try{
        await pool.query(query_text, [user_id, time, message, 0])
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    setNewMessage: setNewMessage
}