import { MongoClient } from "mongodb";

const collectionName = "charge-receipts";

export class ReceiptRepository {
  /**
   * Create a new repository for interacting with the charge receipts database
   * @param {MongoClient} client
   */
  constructor(client) {
    this.client = client;
  }

  _getReceiptCollection() {
    return this.client.db(process.env.DB_NAME).collection(collectionName);
  }

  async ensureIndexes() {
    const collection = this._getReceiptCollection();
    await collection.createIndex("receipt.stoppedOn");
  }

  async getLatestReceipt() {
    const query = this._getReceiptCollection().find().sort("receipt.stoppedOn", "desc").limit(1);
    return await query.next();
  }

  async insertReceipts(receipts) {
    await this._getReceiptCollection().insertMany(receipts.map((receipt) => ({ receipt })));
  }
}
