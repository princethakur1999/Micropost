import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema(

    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            trim: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    },
    {
        timestamps: true
    }
);


const Comment = mongoose.model("Comment", commentSchema);

export default Comment; 
