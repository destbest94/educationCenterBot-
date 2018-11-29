const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const Moment = require('moment')
const Users = require('../controllers/users')
const Questions = require('../controllers/questions')
const Answers = require('../controllers/answers')
const Feedback = require('../controllers/feedback')

const Constants = require('../constants')

async function commStart(ctx){
    const user = await Users.setNewUser(ctx.message.from)
    if(!user.language){
        const message = (Constants.UZB.WELCOME+"\n"
            + Constants.RUS.WELCOME+"\n"
            + Constants.ENG.WELCOME+"\n"
            + Constants.START)
        showLanguageMenu(ctx, message)
    }else{
        const language = await Users.getLanguage(user.language)
        showMainMenu(ctx, language)
    }
} 

function showLanguageMenu(ctx, message){
   return ctx.reply(message, Extra.markup(
        Markup.keyboard([
            [
                Markup.callbackButton('🇺🇿'),
                Markup.callbackButton('🇷🇺'),
                Markup.callbackButton('🇬🇧')
            ]
        ]).oneTime().resize()
    ))
}

function showSettingsMenu(ctx, language){
    return ctx.reply(language.LABEL, Extra.markup(
        Markup.keyboard([
            [language.SETTINGS_MENU.LANGUAGE_BTN, language.SETTINGS_MENU.AUTH_BTN], // Row1 with 2 buttons
            [language.BACK_BTN] //Rows2 with 1 button
        ])
        .oneTime()
        .resize()
    )).catch(err =>{
        console.log(err)
    })
}

async function hearSetUz(ctx){
    await Users.setLanguage(ctx.message.from.id, Constants.UZ)
    hearSetLanguage(ctx, Constants.UZB)
}

async function hearSetEn(ctx){
    await Users.setLanguage(ctx.message.from.id, Constants.EN)
    hearSetLanguage(ctx, Constants.ENG)
}

async function hearSetRu(ctx){
    await Users.setLanguage(ctx.message.from.id, Constants.RU)
    hearSetLanguage(ctx, Constants.RUS)
}

async function hearSetLanguage(ctx, language){
    if(!language){
        language = await Users.getLanguage(ctx.message.from.id)
    }
    await ctx.reply(language.LANGUAGE)
    showMainMenu(ctx, language)
}

async function showMessage(ctx, message){
    try{
        if(typeof ctx.message.from.id != 'undefined'){
            const user = await Users.getUser(ctx.message.from.id)
            if(user.user_status == 1){
                if(await Feedback.setNewMessage(ctx)){
                    const language = await Users.getLanguage(ctx.message.from.id)
                    message = language.MESSAGE_MENU.LABEL_END
                }
            }
        }
    }catch(err){
        console.log(err)     
    }

    ctx.reply(message).catch(err =>{
        console.log(err)
    })
}

function showMainMenu(ctx, language){
    return ctx.reply(language.LABEL, Markup.keyboard([
        [language.MAIN_MENU.TEST_BTN], // Row1 with 1 buttons
        [language.MAIN_MENU.RESULTS_BTN, language.MAIN_MENU.SETTINGS_BTN], // Row2 with 2 buttons 
        [language.MAIN_MENU.ABOUT_BTN, language.MAIN_MENU.MESSAGE_BTN], // Row3 with 2 buttons
    ]).resize().extra()
    ).catch(err =>{
        console.log(err)
    })
}

function showAuthMenu(ctx, language){
    return ctx.reply(language.AUTH_MENU.LABEL, Extra.markup((markup) => {
        return markup.resize()
          .keyboard([
            markup.contactRequestButton(language.AUTH_MENU.BTN),
            markup.callbackButton(language.BACK_BTN)
          ])
    })).catch(err =>{
        console.log(err)
    })
}

async function setPhone(ctx){
    try{
        const language = await Users.getLanguage(ctx.message.from.id)
        await Users.setPhone(ctx.message.from.id, ctx.update.message.contact.phone_number)
        await showMessage(ctx, language.AUTH_MENU.CONFIRMED)
        await showMainMenu(ctx, language)
    }catch(err){
        console.log(err)
    }
}

async function showQuestion(ctx, language){
    try{
        const questions = await Questions.getQuestions()
        let i = 0;
        for(const question of questions){
            i++
            await ctx.reply(i +") " + question.question, Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('A', Constants.A),
                        Markup.callbackButton('B', Constants.B),
                        Markup.callbackButton('C', Constants.C),
                        Markup.callbackButton('D', Constants.D)
                    ]
                ]).resize()
            ))
        }
        await Answers.setNew(ctx)
        showTestMenu(ctx, language)
    }catch(err){
        console.log(err)
    }
}

function showTestMenu(ctx, language){
    return ctx.reply(language.TEST_MENU.LABEL, Extra.markup((markup) => {
        return markup.resize()
          .keyboard([
            markup.callbackButton(language.TEST_MENU.END_BTN)
          ])
    })).catch(err =>{
        console.log(err)
    })
}

async function choosAnswer(ctx){
    let buttons = {}
    let mess = ""
    let user_id = ""
    let number = ""
    let success = false
    switch(ctx.callbackQuery.data){
        case Constants.A:
            buttons = Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('*A*', Constants.A),
                        Markup.callbackButton('B', Constants.B),
                        Markup.callbackButton('C', Constants.C),
                        Markup.callbackButton('D', Constants.D)
                    ]
                ]).resize())
            mess = ctx.callbackQuery.message.text
            user_id = ctx.callbackQuery.from.id
            number = mess.split(')')[0]
            success = await Answers.setNewAnswer(user_id, number, Constants.A)
            break
        case Constants.B:
            buttons = Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('A', Constants.A),
                        Markup.callbackButton('*B*', Constants.B),
                        Markup.callbackButton('C', Constants.C),
                        Markup.callbackButton('D', Constants.D)
                    ]
                ]).resize())
            mess = ctx.callbackQuery.message.text
            user_id = ctx.callbackQuery.from.id
            number = mess.split(')')[0]
            success = await Answers.setNewAnswer(user_id, number, Constants.B)
            break
        case Constants.C:
            buttons = Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('A', Constants.A),
                        Markup.callbackButton('B', Constants.B),
                        Markup.callbackButton('*C*', Constants.C),
                        Markup.callbackButton('D', Constants.D)
                    ]
                ]).resize())
            mess = ctx.callbackQuery.message.text
            user_id = ctx.callbackQuery.from.id
            number = mess.split(')')[0]
            success = await Answers.setNewAnswer(user_id, number, Constants.C)
            break
        case Constants.D:
            buttons = Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('A', Constants.A),
                        Markup.callbackButton('B', Constants.B),
                        Markup.callbackButton('C', Constants.C),
                        Markup.callbackButton('*D*', Constants.D)
                    ]
                ]).resize())
            mess = ctx.callbackQuery.message.text
            user_id = ctx.callbackQuery.from.id
            number = mess.split(')')[0]
            success = await Answers.setNewAnswer(user_id, number, Constants.D)
            break
    }
    ctx.answerCbQuery()
    if(success)
        await ctx.editMessageText(ctx.callbackQuery.message.text, buttons).catch(err => {
            console.log(err)
        })
}

async function endingTest(ctx, language){
    const user_id = ctx.message.from.id
    const date = ctx.message.date
    const {rows} = await Answers.getAnswer(user_id)
    const ans = rows[0].user_answers
    if(ans.search(Constants.X[0]) != -1){
        await ctx.reply(language.TEST_MENU.LABEL_END, Extra.markup(
            Markup.inlineKeyboard([
                [
                    Markup.callbackButton(language.YES, 'YES'),
                    Markup.callbackButton(language.NO, 'NO')
                ]
            ]).resize()
        )).catch(err => {
            console.log("ERROR!! endingTest")
            console.log(err)
        })
    }else{
        await Answers.endingTest(user_id, date)
        await showMessage(ctx, language.TEST_MENU.LABEL_ENDED)
        await showMainMenu(ctx, language)
    }
} 

async function buttonYesNO(ctx, language){
    const user_id = ctx.callbackQuery.from.id
    const date = ctx.callbackQuery.message.date
    if(ctx.callbackQuery.data == 'YES'){
        if(await Answers.endingTest(user_id, date)){
            await showMessage(ctx, language.TEST_MENU.LABEL_ENDED)
            showMainMenu(ctx, language)
        }
    }else{
        await showMessage(ctx, language.TEST_MENU.LABEL_NOTENDED)
    }
    ctx.answerCbQuery()
}

async function showResults(ctx, language){
    try{
        const {rows} = await Answers.getAnswer(ctx.message.from.id)
        results = rows[0]
        const begin = Moment.unix(results.create_at).format("DD.MM.YYYY HH:mm")
        const end = Moment.unix(results.close_at).format("DD.MM.YYYY HH:mm")
        let level = Constants.BEGINER
        if(results.right_ans >= 29){
            level = Constants.ADVANCED
        }else if(results.right_ans >= 25){
            level = Constants.UPPER
        }else if(results.right_ans >= 20){
            level = Constants.INTER
        }else if(results.right_ans >= 15){
            level = Constants.PRE
        }else if(results.right_ans >= 10){
            level = Constants.ELEMENTARY
        }else if(results.right_ans >= 0){
            level = Constants.BEGINER
        }

        await showMessage(ctx, 
                language.RESULT_MENU.BEGIN + begin + "\n"
                + language.RESULT_MENU.END + end + "\n"
                + language.RESULT_MENU.RIGHT + results.right_ans + "\n"
                + language.RESULT_MENU.WRONG + results.wrong_ans + "\n"
                + language.RESULT_MENU.UNSOLVED + results.unsolved_ans + "\n"
                + language.RESULT_MENU.LEVEL + level + "\n"
            )
    }catch(err){
        console.log(err)
        await showMessage(ctx, language.RESULT_MENU.NO_RESULT)
    }
}

function showAbout(ctx, language){
    showMessage(ctx, language.ABOUT_MENU.ABOUT)
}

async function showMessageMenu(ctx, language){
    if(await Users.setMessage(ctx.message.from.id, 1)){
        await ctx.reply(language.MESSAGE_MENU.LABEL, Markup.keyboard([
            [language.MESSAGE_MENU.BTN], // Row1 with 1 buttons
        ]).resize().extra()
        ).catch(err =>{
            console.log(err)
        })
        await showMessage(ctx, "")
    }
}

async function closeSendingMessage(ctx, language){
    if(await Users.setMessage(ctx.message.from.id, 0)){
        await showMainMenu(ctx, language)
    }
}

module.exports = {
    commStart: commStart,
    hearSetUz: hearSetUz,
    hearSetEn: hearSetEn,
    hearSetRu: hearSetRu,
    showMainMenu: showMainMenu,
    showSettingsMenu: showSettingsMenu,
    showLanguageMenu: showLanguageMenu,
    showAuthMenu: showAuthMenu,
    showMessageMenu: showMessageMenu,
    showMessage: showMessage,
    showQuestion: showQuestion,
    showResults: showResults,
    showAbout: showAbout,
    setPhone: setPhone,
    choosAnswer: choosAnswer,
    endingTest: endingTest,
    buttonYesNO: buttonYesNO,
    closeSendingMessage: closeSendingMessage
}