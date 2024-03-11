import { db } from ".";
import { stocks } from "./schema";

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(stocks);

    const stockData = [
      {
        name: "AAPL",
        data: [
          { price: 100, date: "2021-01-01" },
          { price: 110, date: "2021-01-02" },
          { price: 120, date: "2021-01-03" },
          { price: 130, date: "2021-01-04" },
          { price: 140, date: "2021-01-05" },
        ],
      },
      {
        name: "GOOG",
        data: [
          { price: 200, date: "2021-01-01" },
          { price: 210, date: "2021-01-02" },
          { price: 220, date: "2021-01-03" },
          { price: 230, date: "2021-01-04" },
          { price: 240, date: "2021-01-05" },
        ],
      },
      {
        name: "MSFT",
        data: [
          { price: 300, date: "2021-01-01" },
          { price: 310, date: "2021-01-02" },
          { price: 320, date: "2021-01-03" },
          { price: 330, date: "2021-01-04" },
          { price: 340, date: "2021-01-05" },
        ],
      },
    ];

    await db.insert(stocks).values(stockData);

    console.log("Seeded database");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
