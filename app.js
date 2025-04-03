var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var axios = require("axios");
const { MongoClient } = require("mongodb");
const path = require("path");

const PASS = "JHqYbLyw1c0dd1kg";

// mongodb+srv://sakothar:<password>@web-tech.zo9bcaj.mongodb.net/?retryWrites=true&w=majority&appName=web-tech
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "dist/assignment_3/browser")));

var jsonParser = bodyParser.json();

const API_KEY = "cmupv4pr01qltmc15q1gcmupv4pr01qltmc15q20";
POLYGON_API_KEY = "ylipoJkBVyzZDppG1ybwkXnFy_PjWEf0";

const uri = `mongodb+srv://sakothar:${PASS}@web-tech.zo9bcaj.mongodb.net/?retryWrites=true&w=majority&appName=web-tech`;
const client = new MongoClient(uri);
// client.connect()

app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  const url = `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.result); // Adjust based on Finnhub's response structure
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/details/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const data = await axios.get(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${API_KEY}`
  );
  res.status(200).json(data.data);
});

app.get("/quote/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const data = await axios.get(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`
  );
  res.status(200).json({ ...data.data, ticker });
});

app.get("/peers/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const data = await axios.get(
    `https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${API_KEY}`
  );
  res.status(200).json(data.data);
});

app.get("/news/:ticker", async (req, res) => {
  const ticker = req.params.ticker;

  //   credits: chatgpt - get today's date and date 6 months ago in YYYY-MM-DD format, js
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // getMonth() is zero-based
  let dd = today.getDate();

  // Convert month and day to string and add leading zeros if necessary
  mm = (mm < 10 ? "0" : "") + mm;
  dd = (dd < 10 ? "0" : "") + dd;

  // Format today's date
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  // Calculate the date 6 months ago
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
  const pastYear = sixMonthsAgo.getFullYear();
  let pastMonth = sixMonthsAgo.getMonth() + 1;
  let pastDay = sixMonthsAgo.getDate();

  // Convert month and day to string and add leading zeros if necessary
  pastMonth = (pastMonth < 10 ? "0" : "") + pastMonth;
  pastDay = (pastDay < 10 ? "0" : "") + pastDay;

  // Format the date 6 months ago
  const formattedSixMonthsAgo = `${pastYear}-${pastMonth}-${pastDay}`;

  const data = await axios.get(
    `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${formattedSixMonthsAgo}&to=${formattedToday}&token=${API_KEY}`
  );
  res.status(200).json(data.data);
});

app.get("/money", async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("wallet");
  try {
    const wallet = await collection.findOne();
    if (wallet && wallet.hasOwnProperty("money")) {
      res.status(200).json({ money: wallet["money"] });
    } else {
      await collection.insertOne({ money: 25000 });
      res.status(200).json({ money: 25000 });
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
});

app.get("/sentiments/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const data = await axios.get(
    `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${API_KEY}`
  );
  let totalMSPR = 0;
  let positiveMSPR = 0;
  let negativeMSPR = 0;
  let positiveChange = 0;
  let negativeChange = 0;
  let totalChange = 0;

  data.data.data.forEach((insider) => {
    totalMSPR += insider.mspr;
    totalChange += insider.change;

    if (insider.mspr >= 0) {
      positiveMSPR += insider.mspr;
    } else {
      negativeMSPR += insider.mspr;
    }

    if (insider.change >= 0) {
      positiveChange += insider.change;
    } else {
      negativeChange += insider.change;
    }
  });

  res.status(200).json({
    totalChange,
    positiveChange,
    negativeChange,
    totalMSPR,
    positiveMSPR,
    negativeMSPR,
    symbol: data.data.symbol,
  });
});

app.get("/recommendations/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const data = await axios.get(
    `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${API_KEY}`
  );
  res.status(200).json(data.data);
});

app.get("/earnings/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const data = await axios.get(
    `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${API_KEY}`
  );
  res.status(200).json(data.data);
});

app.get("/history/:ticker", async (req, res) => {
  const ticker = req.params.ticker;

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // getMonth() is zero-based
  let dd = today.getDate();
  mm = (mm < 10 ? "0" : "") + mm;
  dd = (dd < 10 ? "0" : "") + dd;
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));
  const pastYear = twoYearsAgo.getFullYear();
  let pastMonth = twoYearsAgo.getMonth() + 1;
  let pastDay = twoYearsAgo.getDate();

  pastMonth = (pastMonth < 10 ? "0" : "") + pastMonth;
  pastDay = (pastDay < 10 ? "0" : "") + pastDay;

  const formattedTwoYearsAgo = `${pastYear}-${pastMonth}-${pastDay}`;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedTwoYearsAgo}/${formattedToday}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/hourly/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  mm = (mm < 10 ? "0" : "") + mm;
  dd = (dd < 10 ? "0" : "") + dd;
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const year = twoDaysAgo.getFullYear();
  const month = `0${twoDaysAgo.getMonth() + 1}`.slice(-2); // Adding 1 because months are 0 indexed
  const day = `0${twoDaysAgo.getDate()}`.slice(-2);

  const formattedDate = `${year}-${month}-${day}`;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${formattedDate}/${formattedToday}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.results);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/portfolio", async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("portfolio");
  try {
    const watchlist = await collection.find({}).toArray();
    const dataPromises = watchlist.map(async (stock) => {
      const q = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=${API_KEY}`
      );
      const avg = stock.totalCost / stock.quantity;
      const market_val = stock.quantity * q.data.c;
      const change = q.data.c - avg;
      return { ...q.data, ...stock, avg, market_val, change };
    });

    const data = await Promise.all(dataPromises);
    res.status(200).json(data);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/portfolio/:ticker", async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("portfolio");
  const ticker = req.params.ticker;
  try {
    const stock = await collection.findOne({ ticker });

    if (stock) {
      res.status(200).json(stock);
    } else {
      res.status(404).json({ message: "Stock not found" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/portfolio/buy", jsonParser, async (req, res) => {
  try {
    const db = client.db("web-tech");
    const collection = db.collection("portfolio");
    const { ticker, name, price, quantity } = req.body;

    if (!ticker) {
      res.status(400).send("Ticker is required");
      return;
    }

    const stock = await collection.findOne({ ticker });
    await db
      .collection("wallet")
      .updateOne({}, { $inc: { money: -(price * quantity) } });

    if (stock) {
      const newQuantity = stock.quantity + quantity;
      const newTotalCost = (stock.totalCost || 0) + quantity * price;
      const response = await collection.updateOne(
        { ticker: ticker },
        { $set: { quantity: newQuantity, totalCost: newTotalCost } }
      );

      res.status(200).json(response);
    } else {
      const response = await collection.insertOne({
        ticker,
        quantity,
        totalCost: quantity * price,
        name,
      });
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/portfolio/sell", jsonParser, async (req, res) => {
  const { ticker, name, price, quantity } = req.body;

  try {
    const db = client.db("web-tech");
    const collection = db.collection("portfolio");

    const stock = await collection.findOne({ ticker: ticker });
    await db
      .collection("wallet")
      .updateOne({}, { $inc: { money: price * quantity } });

    if (stock) {
      const newQuantity = stock.quantity - quantity;
      const newTotalCost =
        newQuantity > 0 ? (stock.totalCost * newQuantity) / stock.quantity : 0;

      if (newQuantity > 0) {
        const response = await collection.updateOne(
          { ticker: ticker },
          { $set: { quantity: newQuantity, totalCost: newTotalCost } }
        );
        res.status(200).json(response);
      } else {
        const response = await collection.deleteOne({ ticker });
        res.status(200).json(response);
      }
    } else {
      res.status(404).send({ message: `${ticker} not found in portfolio` });
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/watchlist", async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("watchlist");
  try {
    const watchlist = await collection.find({}).toArray();
    const dataPromises = watchlist.map(async (stock) => {
      const q = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=${API_KEY}`
      );
      return { ...q.data, ...stock };
    });

    // Use Promise.all to wait for all the axios requests to complete
    const data = await Promise.all(dataPromises);

    res.status(200).json(data);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/watchlist/:ticker", async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("watchlist");
  const ticker = req.params.ticker;
  try {
    const stock = await collection.findOne({ ticker });

    if (stock) {
      res.status(200).json(stock);
    } else {
      res.status(404).json({ message: "Stock not found" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/watchlist", jsonParser, async (req, res) => {
  try {
    const db = client.db("web-tech");
    const collection = db.collection("watchlist");
    const ticker = req.body.ticker;
    const name = req.body.name;

    if (!ticker) {
      res.status(400).send("Ticker is required");
      return;
    }

    await collection.insertOne({ name, ticker });
    res.send({ message: `Ticker ${ticker} added to watchlist` });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/watchlist/:ticker", jsonParser, async (req, res) => {
  const db = client.db("web-tech");
  const collection = db.collection("watchlist");
  const ticker = req.params.ticker;
  try {
    await collection.deleteOne({ ticker });
    res.send({ message: `${ticker} deleted from watchlist` });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

// async function main() {
//   try {
//     await client.connect();
//     app.listen(PORT, () => {
//       console.log(`Example app listening on port http://localhost:${PORT}`);
//     });
//   } catch (e) {
//     console.error(e);
//   }
// }

// main().catch(console.error);

client.connect();
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
