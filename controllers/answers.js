const pool = require('../database/PgHelper')
const Constants = require('../constants')

async function setNew(ctx) {
    try{
        const query_text = `INSERT INTO results (user_id, user_answers, create_at) VALUES ($1, $2, $3)`
        await pool.query(query_text, [ctx.message.from.id, Constants.X, ctx.message.date])
    }catch(err){
        console.log(err)
    }
}

async function getAnswer(user_id) {
    try{
        const query_text = `SELECT * FROM results WHERE user_id = '${user_id}' ORDER BY id DESC LIMIT 1`
        const answers = await pool.query(query_text)
        return answers
    }catch(err){
        console.log(err)
        return false
    }
}
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + 1);
}

async function setNewAnswer(user_id, number, newAns){
    try{
        const { rows } = await getAnswer(user_id)
        if(rows[0].close_at) return;
        const id = rows[0].id
        const answerString = rows[0].user_answers.replaceAt(number-1, newAns)
        const query_text = `UPDATE results SET user_answers = '${answerString}' WHERE id = ${id}`
        await pool.query(query_text)
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

function checkAnswers(user_answers){
    results = {
        right : 0,
        wrong : 0,
        unsolved : 0
    }
    for(var i=0; i<user_answers.length; i++){
        if(user_answers[i] == Constants.TRUE_ANSWERS[i]){
            results.right++
        }else if(user_answers[i] == Constants.X[0]){
            results.unsolved++
        }else{
            results.wrong++
        }
    }
    return results
}

async function endingTest(user_id, date){
    try{
        const { rows } = await getAnswer(user_id)
        const id = rows[0].id
        const close_at = rows[0].close_at
        const res = await checkAnswers(rows[0].user_answers)
        if(!close_at){
            const query_text = `UPDATE results SET close_at = '${date}', right_ans = '${res.right}', wrong_ans = '${res.wrong}', unsolved_ans = '${res.unsolved}' WHERE id = ${id}`
            await pool.query(query_text)
            return true
        }
    }catch(err){
        console.log(err)
        return false
    }
}


module.exports = {
    setNew: setNew,
    getAnswer: getAnswer,
    setNewAnswer: setNewAnswer,
    endingTest: endingTest
}