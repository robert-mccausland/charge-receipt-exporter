import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { ReceiptService } from "./src/receipt-service.js";
import { ReceiptRepository } from "./src/receipt-repository.js";

config();

// Create mongo client to connect to repo
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/**
 * Main function
 */
async function main() {
  const receiptsService = new ReceiptService();
  const pollingRate = parseFloat(process.env.POLLING_RATE);
  console.info(`Polling for new receipts every ${pollingRate} seconds, press Ctrl+C to stop`);

  // Run immediately to get fast feedback
  await updateReceipts(receiptsService);

  // Create job to update receipt periodically
  setInterval(() => updateReceipts(receiptsService), pollingRate * 1000);
}

/**
 * Sync the database with any new receipts from the API
 * @param {ReceiptService} receiptsService
 */
async function updateReceipts(receiptsService) {
  try {
    const start = performance.now();
    console.info("Checking for new receipts...");

    // Connect to database
    await client.connect();
    const repository = new ReceiptRepository(client);
    await repository.ensureIndexes(repository);

    // Find the last receipt that we have in the database
    const lastReceipt = await repository.getLatestReceipt();

    // Use current time if we don't have any receipts yet to avoid trying to backfill the entire database
    let lastReceiptTime = lastReceipt?.receipt?.stoppedOn || new Date().getTime();

    // Pull any new receipts from the API
    const receipts = await receiptsService.getNewReceipts(lastReceiptTime);

    // Insert new receipts into the database
    await repository.insertReceipts(receipts);

    const seconds = ((performance.now() - start) / 1000).toFixed(2);
    console.info(
      `Successfully added ${receipts.length} new receipts to the database in ${seconds} seconds`
    );
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

main().catch((err) => console.error(err));
