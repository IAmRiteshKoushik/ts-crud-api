import express from "express";
import { get, merge }  from "lodash";

import { getUserBySessionToken } from "../db/users";

// Account deletions to be allowed only if the account owner is requesting 
// for it. Otherwise deletion should not be allowed.
export const isOwner = async (req: express.Request, 
    res: express.Response, next: express.NextFunction) => {
    
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            return res.sendStatus(403);
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// Authentication middleware
export const isAuthenticated = async (req: express.Request, 
    res: express.Response, next: express.NextFunction) => {

    try {
        const sessionToken = req.cookies['ANTONIO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403); // Forbidden (no session token)
        }

        const existingUser = getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403); // Forbidden (token valid, no user exist)
        }
        merge(req, { identity: existingUser });
        return next();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

