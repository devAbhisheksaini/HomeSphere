const ListingModel = require("../models/Listing.model")

exports.createListing = async (req, res) => {
    try {
        const listing = await ListingModel.create(req.body);
        return res.status(201).json({
            success: true,
            message: `Listing created successfully`,
            listing
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error creating listing`,
            err
        })
    }
}


exports.deleteListing = async (req, res) => {
    try {

        const listing = await ListingModel.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: `Listing not found`,
            })
        }
        if (req.user.id !== listing.userRef) {
            return res.status(401).json({
                success: false,
                message: `You cna only delete your listings`,
            })
        }
        await ListingModel.findByIdAndDelete(req.params.id)
        return res.status(201).json({
            success: true,
            message: `Listing deleting  successfully`,
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }

}
exports.updateListing = async (req, res) => {
    try {

        const listing = await ListingModel.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: `Listing not found`,
            })
        }
        if (req.user.id !== listing.userRef) {
            return res.status(401).json({
                success: false,
                message: `You cna only delete your listings`,
            })
        }
        const updateListing = await ListingModel.findByIdAndUpdate(req.params.id, req.body,
            { new: true })
        // const updatedlisting = await ListingModel.findByIdAndUpdated()
        return res.status(201).json({
            success: true,
            message: `Listing update  successfully`,
            updateListing
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.getList = async (req, res) => {
    try {
        const listing = await ListingModel.findById(req.params.id);
        if (listing) {
            return res.status(200).json({
                success: true,
                listing
            })
        }
        return res.status(404).json({
            success: false,
            message: `Listing not found`
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


exports.getListings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await ListingModel.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json({
            success: true,
            listings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}