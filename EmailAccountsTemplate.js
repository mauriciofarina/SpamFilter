var accounts = {

    blacklist: {
        emailSettings:{
            inbox: 'INBOX',
            trash: '[Gmail]/Trash'
        },
        imap: {
            user: 'username@gmail.com',
            password: 'PASSWORD',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 10000
        }
    },

    emails: [

        {
            emailSettings:{ //Example Gmail
                inbox: 'INBOX',
                trash: '[Gmail]/Trash'
            },
            imap: {
                user: 'username@gmail.com',
                password: 'PASSWORD',
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 10000
            }
        },
        {
            emailSettings:{ //Example Kinghost
                inbox: 'INBOX',
                trash: 'INBOX.Trash'
            },
            imap: {
                user: 'username@domain',
                password: 'PASSWORD',
                host: 'imap.domain.com.br',
                port: 143,
                tls: false,
                authTimeout: 10000
            }
        }


    ]

}

module.exports = accounts