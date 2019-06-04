var imaps = require('imap-simple')
const _cliProgress = require('cli-progress')
const fs = require('fs')
const accounts = require('./EmailAccounts')
const clear = require('clear')
clear()



var runningFlag = false

setInterval(() => {

    if (!runningFlag) {
        
        runningFlag = true

        console.log('----------------------- Spam Filter -----------------------\n')

        console.log('***** Loading Blacklist *****\n')


        var blacklist = new Set()

        try {
            var temp = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'))
            for (i in temp) blacklist.add(temp[i])
        }
        catch (e) { console.log(e) }

        const blacklistOldSize = blacklist.size
        process.stdout.write('Blacklisted Emails Loaded: ' + blacklistOldSize + '                  \r');

        getBlacklist(blacklist).then(async (blacklist) => {

            console.log('***** Filtering Emails *****\n')
            for (i in accounts.emails) {

                await filterEmail(accounts.emails[i], blacklist)
            }

            console.log("\nALL DONE!")
            runningFlag = false


        }).catch((e) => {
            console.log(e + " THE ERROR IS..")
            runningFlag = false
        })

    }

}, 1000);














const getBlacklist = async (blacklist) => {


    var timeout = setTimeout(() => {

        console.log("Execution Timeout!                                              ")
        process.exit()

    }, 60000)

    process.stdout.write('Updating Backlist...' + '                   \r');

    const connection = await imaps.connect(accounts.blacklist)
    await connection.openBox('INBOX')

    var searchCriteria = ['ALL']
    var fetchOptions = { bodies: ['HEADER.FIELDS (FROM)'], markSeen: true }

    const results = await connection.search(searchCriteria, fetchOptions)

    var uidList = []


    for (i in results) {

        var uid = results[i].attributes.uid
        uidList.push(uid)

        var fromFull = results[i].parts[0].body.from[0]


        var from = getEmail(fromFull)

        if (from !== null) blacklist.add(from)

    }

    if (uidList.length) await connection.moveMessage(uidList, '[Gmail]/Trash')

    await connection.end()

    const blacklistOldSize = blacklist.size
    process.stdout.write('New Emails Added to Blacklist: ' + (blacklist.size - blacklistOldSize) + '                   \r\n\n');

    var blacklistArray = Array.from(blacklist)
    fs.writeFileSync('./blacklist.json', JSON.stringify(blacklistArray), 'utf-8')

    clearTimeout(timeout)

    return blacklist
}


const filterEmail = async (emailAccount, blacklist) => {

    var timeout = setTimeout(() => {

        console.log("Execution Timeout!                                          ")
        process.exit()

    }, 60000)

    var emailString = await pad(padding, emailAccount.imap.user, true)
    const progressBar = new _cliProgress.Bar(
        { format: emailString + ' [{bar}] {percentage}% | {value}/{total} |' },
        _cliProgress.Presets.shades_classic)

    process.stdout.write('Connecting to: ' + emailAccount.imap.user + '                   \r');
    const connection = await imaps.connect(emailAccount)

    await connection.openBox(emailAccount.emailSettings.inbox)
    var searchCriteria = ['ALL']
    var fetchOptions = { bodies: ['HEADER.FIELDS (FROM)'], markSeen: false }
    process.stdout.write('Fetching Emails...' + '                                   \r');
    const results = await connection.search(searchCriteria, fetchOptions)


    var uidList = []

    for (i in results) {

        var uid = results[i].attributes.uid
        var fromFull = results[i].parts[0].body.from[0]

        var from = getEmail(fromFull)

        if (blacklist.has(from) && from !== null) {
            uidList.push(uid)
        }
    }

    progressBar.start(uidList.length, 0);

    for (i in uidList) {
        await connection.moveMessage(uidList[i], emailAccount.emailSettings.trash)
        progressBar.increment()
    }


    await connection.end()


    progressBar.stop();

    clearTimeout(timeout)

    return 0
}



const getEmail = (fromFull) => {

    var from = null

    if (fromFull.includes("<") && fromFull.includes("<")) {
        from = fromFull.substring(
            fromFull.lastIndexOf("<") + 1,
            fromFull.lastIndexOf(">"))
    }
    else if (fromFull.includes("<") || fromFull.includes("<")) {
        fs.writeFileSync('./BadLog' + new Date().getTime(), JSON.stringify(fromFull), 'utf-8')
        from = null
    }
    else {
        from = fromFull
    }

    return from
}





const pad = async (pad, str, padLeft) => {
    if (typeof str === 'undefined')
        return pad
    if (padLeft) {
        return (pad + str).slice(-pad.length)
    } else {
        return (str + pad).substring(0, pad.length)
    }
}

var stringLen = 0
for (i in accounts.emails) {
    var emailLen = accounts.emails[i].imap.user.length
    if (stringLen < emailLen) {
        stringLen = emailLen
    }
}
var padding = Array(stringLen + 1).join(' ')





