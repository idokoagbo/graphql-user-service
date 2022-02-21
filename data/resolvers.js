const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');
const mailer = require('../config/mail');

async function tokenGauntlet(email, token, verify = false) {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('Incorrect email address');
    }

    if (user.isVerified) {
        throw new Error('Email Already Verified');
    }

    const verificationToken = await VerificationToken.findOne({ token: token, userId: user.id });

    if (!verificationToken) {
        throw new Error('Invalid Verification Token');
    }

    if (verify) {
        if (verificationToken.expiresAt < Date.now()) {
            // expired token
            throw new Error('Expired Verification Token');
        }

        user.isVerified = true;
        user.updatedAt = Date.now();
    }

    return user;
}

async function generateToken(user) {
    const newToken = crypto.randomBytes(16).toString('hex');

    const verificationToken = await new VerificationToken({
        id: new mongoose.Types.ObjectId(),
        token: newToken,
        userId: user.id
    }).save();

    // compose mail body
    const body = `<p> <b>Account Verification</b></p> 
    <p>Howdy ${user.name},</p> 
    <p>Thank you for choosing ${process.env.APP_NAME}! <br/>Please confirm your email address by clicking the link below. We'll communicate important updates with you from time to time via email, so it's essential that we have an up-to-date email address on file.</p> 
    <center>
    <a href='${process.env.APP_URL}/verify?email=${user.email}&token=${newToken}' style='text-decoration:none;color:#ffffff;font-size:18px; line-height: 24px; display:block;background-color:#0275d8;padding:10px'>Verify your email address</a>
    </center>`;

    // send email & return verification token
    return mailer.send(user.email, `Hi ${user.name}, Please verify your ${process.env.APP_NAME} account`, body).then((_) => verificationToken);
}

const resolvers = {
    Query: {
        user: async (_, args, { user }) => {
            // check user is logged in
            if (!user) {
                throw new Error('You are not authenticated');
            }

            return await User.findOne({ id: user.id });
        },
        users: async () => {
            const users = await User.find();
            return users;
        }
    },

    Mutation: {
        // handle sign up
        signup: async (_, args) => {

            //check if email already exists
            const existingAccount = await User.findOne({ email: args.email });
            if (existingAccount) {
                throw new Error('Account with email address already exists');
            }

            const user = await new User({
                id: new mongoose.Types.ObjectId(),
                name: args.name,
                email: args.email,
                phone: args.phone,
                country: args.country,
                password: await bcrypt.hash(args.password, 10)
            }).save();

            await generateToken(user);

            return user;
        },

        // handle login
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new Error('Incorrect email address');
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                throw new Error('Incorrect Password');
            }

            //check verified account

            if (!user.isVerified) {
                throw new Error('Unverified User');
            }

            user.token = jsonwebtoken.sign(
                user,
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            );

            return user;
        },

        // handle verify email
        verify: async (_, { email, token }) => {

            const user = await tokenGauntlet(email, token, true);

            return await User.findOneAndUpdate({ id: user.id }, user);
        },

        // handle verify email
        resendEmail: async (_, { email, token }) => {

            const user = await tokenGauntlet(email, token);

            await generateToken(user);

            return user;
        }
    }
}

module.exports = resolvers;