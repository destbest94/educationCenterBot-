const Users = require('../controllers/users')
const Constants = require('../constants')
const Messages = require('../controllers/messages')

function commStart(ctx){
    Messages.commStart(ctx)
}

function hearSetUz(ctx){
    Messages.hearSetUz(ctx)
}

function hearSetEn(ctx){
    Messages.hearSetEn(ctx)
}

function hearSetRu(ctx){
    Messages.hearSetRu(ctx)
}

function setPhone(ctx){
    Messages.setPhone(ctx)
}

async function onText(ctx){
    const language = await Users.getLanguage(ctx.message.from.id)
    if(!language){
        Messages.showLanguageMenu(ctx, Constants.START)
    }else{
        switch(ctx.message.text){
            case language.MAIN_MENU.SETTINGS_BTN:
                Messages.showSettingsMenu(ctx, language)
                break
            case language.SETTINGS_MENU.LANGUAGE_BTN:
                Messages.showLanguageMenu(ctx, Constants.START)
                break
            case language.SETTINGS_MENU.AUTH_BTN:
                Messages.showAuthMenu(ctx, language)
                break
            case language.BACK_BTN:
                Messages.showMainMenu(ctx, language)
                break
            case language.MAIN_MENU.TEST_BTN:
                Messages.showQuestion(ctx, language)
                break
            case language.TEST_MENU.END_BTN:
                Messages.endingTest(ctx, language)
                break
            case language.MAIN_MENU.RESULTS_BTN: 
                Messages.showResults(ctx, language)
                break
            case language.MAIN_MENU.ABOUT_BTN:
                Messages.showAbout(ctx, language)
                break
            case language.MAIN_MENU.MESSAGE_BTN:
                Messages.showMessageMenu(ctx, language)
                break
            case language.MESSAGE_MENU.BTN:
                Messages.closeSendingMessage(ctx, language)
                break
            default: Messages.showMessage(ctx, language.LABEL)
        }
    }
}

async function onCallBack(ctx){
    const language = await Users.getLanguage(ctx.callbackQuery.from.id)
    if(ctx.callbackQuery.data == 'YES' || ctx.callbackQuery.data == 'NO'){
        Messages.buttonYesNO(ctx,language)
    }else{
        Messages.choosAnswer(ctx)
    }
    
}

module.exports = {
    commStart: commStart,
    hearSetUz: hearSetUz,
    hearSetEn: hearSetEn,
    hearSetRu: hearSetRu,
    setPhone: setPhone,
    onText: onText,
    onCallBack: onCallBack
}