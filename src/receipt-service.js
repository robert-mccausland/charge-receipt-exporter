import axios from "axios";
/**
 * Gets all receipts that were stopped after the parameter `lastDate`.
 * @param {number} lastDate
 * @returns
 */

export class ReceiptService {
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  async _login() {
    const response = await this.axios.post("/login", {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    });

    this.token = response.data.token;
  }

  async getNewReceipts(lastDate) {
    if (!this.token) {
      await this._login();
    }

    const now = new Date().toISOString();
    const pageSize = 100;
    const receipts = [];
    let pageNumber = 1;

    while (true) {
      const response = await this.axios.get("/charge-receipt", {
        // TODO sort ascending date so we get the latest receipts first
        params: {
          pageSize,
          pageNumber,
          fromDate: new Date(lastDate).toISOString(),
          toDate: now,
        },
        headers: {
          Authorization: this.token,
        },
      });

      if (response.status == 403) {
        await this._login();
        continue;
      }

      const data = response.data.data;
      receipts.push(...data);
      if (data.length < pageSize) {
        break;
      }

      pageNumber += 1;
    }

    return receipts;
  }
}
