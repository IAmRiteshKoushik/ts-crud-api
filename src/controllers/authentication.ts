import express from 'express';

import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Check for availability of email and password
        if(!email || !password ){
            return res.sendStatus(400);
        }

        // Should have been an async function, but the action has been
        // written synchronously. Would be better to improve it later on
        // the select() statements are very important because you are forcefully
        // bringing out the salt and the password ... which by default are set 
        // to false during selection
        const user = getUserByEmail(email).select("+authentication.salt +authentication.password");
        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password != expectedHash){
            return res.sendStatus(403); // Forbidden : Password invalid
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        // Cookie based authentication for user sessions (look into it)
        res.cookie('ANTIONIO-AUTH', user.authentication.sessionToken, {
            domain: "localhost",
        });
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password, username } = req.body;
        
        // Checking the presence of email, passwd and username
        if(!email || !password || !username){
            return res.sendStatus(400);
        }

        // Checking if user already exists
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(400);
        }

        const salt = random(); // Generates 128 bytes of data randomly (string)
        // It is better if createUser was an async function and we could use 
        // await syntax with it.
        const user = createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.sendStatus(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
