import { Schema, model } from 'mongoose';

const FriendSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    friendId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Status of friendship
    createdAt: { type: Date, default: Date.now }
});

export default model('Friend', FriendSchema);
