import express from "express";

import authentication from "./authentication";
import users from "./users";

const router = express.Router();

export default(): express.Router => {
    authentication(router); // Adding an authentication layer
    users(router) // Getting users only if the authentication layer works
    return router;
}


