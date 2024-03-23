import mongoose from 'mongoose';

// This would contain the user schema and user model
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    authentication: {
        password: { 
            type: String, 
            required: true, 
            select: false // Field not to be returned during query result
        },
        // Salt is a string which is used to add better password security
        // We add in a string of random text at the beginning of the password
        // string and then hash it so that no two passwords are same
        // Two people can have the same password
        // Two people cannot have the same hashed password
        salt: { 
            type: String, 
            select: false // Field not to be returned during query result
        },
        // Auth token
        sessionToken: { 
            type: String, 
            select: false // Field not to be returned during query result
        },
    },
});

// Exporting models
// A model handles the CRUD operations with the MongoDB collection
// It accepts the parameters : collectionName, collectionSchema
// It returns a model object (it is like cursor in SQL)
// There is a cursor implementation that exists in MongoDB as well
// that allows one to iterate over the results of a query
// However, unlike SQL we use the model object for CRUD instead of cursor
export const UserModel = mongoose.model('User', UserSchema);

// Writing actions which would be consumed by controllers
// Some of these return cursors to the data if the data size is too big
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => {
    UserModel.findOne({
        "authentication.sessionToken" : sessionToken,
    });
};
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => {
    new UserModel(values)
        .save()
        .then((user) => user.toObject());
    // Converts the document into a JSON and returns back
};
export const deleteUserById = (id: string) => {
    UserModel.findOneAndDelete({ _id: id });
};
export const updateUserById = (id: string, values: Record<string, any>) => {
    UserModel.findByIdAndUpdate(id, values);
};
