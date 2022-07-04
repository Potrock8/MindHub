const mongoose = require('mongoose');

const Comment = require('./Comment.js');
const Thread = require('./Thread.js');
const User = require('./User.js')

const options = { useUnifiedTopology: true,
					useNewUrlParser: true
};

const database = {
	connect: (url) => {
		mongoose.connect(url, options, (error) => {
			if(error) throw error;
			console.log(`Connected to ${url}`);
		});
	},

	insertOne: (model, doc, callback) => {
		model.create(doc, (error, result) => {
			if(error) return callback(false);
			console.log(`Added ${result}`);
			return callback(true);
		});
	},

	findOne: (model, query, projection, callback) => {
		model.findOne(query, projection, (error, result) => {
			if(error) return callback(false);
			return callback(result);
		}).lean();
	},

	findMany: function(model, query, projection, callback) {
        model.find(query, projection, function(error, result) {
            if(error) return callback(false);
            return callback(result);
        }).lean();
    },

	updateOne: function(model, filter, update, callback) {
        model.updateOne(filter, update, (error, result) => {
            if(error) return callback(false);
            console.log('Document modified: ' + result.nModified);
            return callback(true);
        });
    },

	deleteOne: function(model, filter, callback) {
		model.deleteOne(filter, (error, result) => {
			if(error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
		});
	},

	deleteMany: function(model, conditions, callback) {
        model.deleteMany(conditions, function (error, result) {
            if(error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
        });
    }
};

module.exports = database;