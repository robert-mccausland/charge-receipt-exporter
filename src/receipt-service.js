import { Axios } from "axios";
/**
 * Gets all receipts that were stopped after the parameter `lastDate`.
 * @param {number} lastDate
 * @returns
 */
export async function getNewReceipts(lastDate) {
  const now = new Date().toISOString();
  const axios = new Axios({ baseURL: process.env.API_URL });
  const pageSize = 100;
  const receipts = [];
  let pageNumber = 1;

  while (true) {
    const response = await axios.get("/charge-receipt", {
      // TODO sort ascending date so we get the latest receipts first
      params: {
        pageSize,
        pageNumber,
        fromDate: new Date(lastDate).toISOString(),
        toDate: now,
      },
    });
    const body = JSON.parse(response.data);
    receipts.push(...body.data);
    if (body.data.length < pageSize) {
      break;
    }

    pageNumber += 1;
  }

  return receipts;
}
