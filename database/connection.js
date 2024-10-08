import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'jobPportal'
        });
        console.log('Connected to the database');
    } catch (err) {
        console.log(`An error occurred while connecting to the database: ${err.message}`);
    }
};


