import express from "express";

import { deleteUserById, getUsers, getUserById } from "../db/users";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        
        return res.status(200).json(users);

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        // Response after deleting the user is stored inside deletedUser 
        const deletedUser = deleteUserById(id);
        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if(!username){
            return res.sendStatus(400);
        }
        const user = getUserById(id);
        await user.save(); // Generated error : Property save DNE

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
