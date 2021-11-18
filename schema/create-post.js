const mongoose= require('mongoose');
const Schema = mongoose.Schema;


const createPost = Schema ({
    title: ({
        type: String,
        required: true
    }),

    name:({
        type: String,
        required: true
    }),

    content:({
        type: String,
        required: true
    }),
    image:{
        type: String,
    },
    status: String,
    date_created: String

}, {timestamps:true})

const createPostSchema = mongoose.model('blog_post', createPost);

module.exports = createPostSchema;