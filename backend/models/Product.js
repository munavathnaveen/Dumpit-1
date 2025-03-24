const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    images: [{
        type: String,
        required: true
    }],
    rating: {
        type: Number,
        default: 0,
        index: true
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    tags: [{
        type: String,
        trim: true,
        index: true
    }],
    discount: {
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        validUntil: {
            type: Date
        }
    },
    shipping: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        isFreeShipping: {
            type: Boolean,
            default: false
        }
    },
    warranty: {
        type: String,
        default: 'No warranty'
    },
    returnPolicy: {
        type: String,
        default: 'No returns'
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
        this.numReviews = this.reviews.length;
    }
    next();
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
    if (this.discount.percentage > 0 && 
        (!this.discount.validUntil || this.discount.validUntil > new Date())) {
        return this.price * (1 - this.discount.percentage / 100);
    }
    return this.price;
});

module.exports = mongoose.model('Product', productSchema);