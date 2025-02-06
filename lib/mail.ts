'use server'

import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import { connectDatabase } from './mongoose'
import { getCookieLng } from './cookie'
import Otp from '@/model/otp.model'

const transporter = nodemailer.createTransport({
  port: +process.env.SMTP_PORT!,
  host: process.env.SMTP_HOST,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOtp(email: string) {
  await connectDatabase()

  const otp = Math.floor(Math.random() * (1000000 - 100000) + 100000)
  const hashedOtp = await bcrypt.hash(otp.toString(), 10)

  await Otp.create({
    email,
    otp: hashedOtp,
    expiredAt: Date.now() + 1000 * 60 * 5,
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Twitter OTP for verification ${new Date().toLocaleString()}`,
    html: `<div>
                <h4>Your verification code is below</h4>
                <h1>${otp}</h1>
            </div>`,
  })
}

export async function verifyOtp(email: string, otp: string) {
  try {
    await connectDatabase()
    const { t } = await getCookieLng()

    const userOtps = await Otp.find({ email })
    const lastOpt = userOtps[userOtps.length - 1]

    if (lastOpt.expiredAt.getTime() < new Date().getTime()) throw new Error(t('codeExpired'))

    const correctOtp = await bcrypt.compare(otp, lastOpt.otp)
    if (!correctOtp) throw new Error(t('incorrectCode'))

    await Otp.deleteMany({ email })
  } catch (error) {
    throw new Error(error as string)
  }
}
