const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema
    .pre('save', async function (next) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    })
    .pre('findOneAndUpdate', async function () {
        const docToUpdate = await this.model.findOne(this.getQuery())

        if (docToUpdate.password !== this._update.password) {
            const newPassword = await bcrypt.hash(this._update.password, 10)
            this._update.password = newPassword;
        }
    })

mongoose.model('users', userSchema);