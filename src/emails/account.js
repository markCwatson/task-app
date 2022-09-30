import sgmail from '@sendgrid/mail'

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'markus.c.watson@gmail.com',
        subject: 'Welcome!',
        text: `Hi ${name}! \n\nWelcome to the Task-App! \n\n Sincerely, \n\nThe Task-App Team`
    }

    sgmail.send(msg)
}

const sendCalcelationEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'markus.c.watson@gmail.com',
        subject: 'Good-bye!',
        text: `Hi ${name}! \n\nSorry to see you go :( \n\n Sincerely, \n\nThe Task-App Team`
    }

    sgmail.send(msg)
}

export { sendWelcomeEmail, sendCalcelationEmail }