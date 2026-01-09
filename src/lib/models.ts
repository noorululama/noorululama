
import mongoose, { Schema, model, models } from 'mongoose';

const AnnouncementSchema = new Schema({
    text: { type: String, required: true },
    link: { type: String },
    label: { type: String, default: 'New' },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Announcement = models.Announcement || model('Announcement', AnnouncementSchema);

const BannerSchema = new Schema({
    imageUrl: { type: String, required: true },
    link: { type: String },
    title: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Banner = models.Banner || model('Banner', BannerSchema);

export { Announcement, Banner };
