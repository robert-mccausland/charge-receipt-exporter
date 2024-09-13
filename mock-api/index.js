import express from "express";
import { createReceipt } from "./create-receipt.js";
import { v4 } from "uuid";

const app = express();

const router = express.Router();

router.get("/charge-receipt", (req, res) => {
  const requestId = v4();
  console.log(req.query);

  const started = new Date().getTime() - 1000;
  const ended = new Date().getTime() - 200;
  res.send({
    requestId: requestId.toString(),
    httpStatusCode: 200,
    count: 5,
    data: [
      createReceipt(started, ended, 69),
      createReceipt(started, ended, 69),
      createReceipt(started, ended, 69),
      createReceipt(started, ended, 69),
      createReceipt(started, ended, 69),
    ],
  });
});

app.use("/api/v1", router);
app.listen(8000);
