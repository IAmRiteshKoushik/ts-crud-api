import mongoose from 'mongoose';

// This would contain the user schema and user model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
});

// Exporting models
export const UserModel = mongoose.model('User', UserSchema);

// Writing actions which would be consumed by controllers
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => {
    UserModel.findOne({
        "authentication.sessionToken" : sessionToken,
    });
};
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => {
    new UserModel(values).save().then((user) => user.toObject());
};
export const deleteuserById = (id: string) => {
    UserModel.findOneAndDelete({ _id: id });
};
export const updateUserById = (id: string, values: Record<string, any>) => {
    UserModel.findByIdAndUpdate(id, values);
};
