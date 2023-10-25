const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    genreName:{type:String, required:true, minLength:3, maxLength: 100},
})
GenreSchema.virtual("url").get(function(){
    return `/catalog/genre/${this._id}`
})
module.exports = mongoose.model("GenreSchema", GenreSchema);