import {Resend} from 'resend'

const resend=new Resend(process.env.RESEND_API_KEY)


export async function sendEmail(to:string, subject:string, html:string){
    const {data,error}=await resend.emails.send({
        from: 'Micromanage <onboarding@resend.dev>',
        to,
        subject,
        html,
    })
    if (error) {
    console.error('Email error:', error)
    throw error
  }

  return data
}
