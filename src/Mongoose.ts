import chalk from "chalk";
import mongoose, { model, models, Schema } from "mongoose";

export async function connect(uri: string) {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log(
            chalk.bold`Connected to mongodb: ${chalk.yellow(
                mongoose.connection.name
            )}`
        );
    } catch (err) {
        console.error(chalk.bold.red`Failed to connect to DB`, err);
        process.exit(1);
    }
}

const urlSchema = new Schema({
    _id: String,
    url: String,
    dest: String,
    clicks: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    key: String,
});

export const Url = models.url || model("url", urlSchema);
