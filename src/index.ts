import cron from 'node-cron';
import dotenv from 'dotenv';
import axios from 'axios';
import Event from './models/event';

const mongoose = require('mongoose');

import { sports } from './sports';

dotenv.config();

const mongoDBUri = process.env.MONGO_URL || "";
const backendUrl = process.env.BACKEND_URL || "";
const allSportDbToken = process.env.ALLSPORTDB_TOKEN || "";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_res: any) => console.log("Conneted to mongoDB"))
  .catch((error: any) => console.error(error));

cron.schedule(`0 0 */1 * * *`, async () => {
  console.log(`running your task...`);

  const startDate = new Date();

  const milliSecondsInTenYears = 315360000000;
  const baseUrl = 'https://api.allsportdb.com/v3/calendar';

  const sportEvents = [];

  try {
    for (const sport of sports) {
      console.log(sport);

      const dateNow = Date.now();
      const dateFrom = (new Date(dateNow)).toDateString();
      const dateTo = (new Date(dateNow + milliSecondsInTenYears)).toDateString();
      const config = {
        method: 'get',
        url: `${baseUrl}/?dateFrom=${dateFrom}&dateTo=${dateTo}&dateToday=${dateFrom}` + (sport ? `&sport=${sport}` : ''),
        headers: {
          'Authorization': `Bearer ${allSportDbToken}`,
          'Accept-Encoding': 'application/json',
          'Accept': 'application/json',
        }
      };

      const response = await axios(config);

      for (const event of response.data) {
        sportEvents.push(event);
      }

      // wait 5 seconds
      await delay(5000);
    }

    console.log("SPORT EVENTS", sportEvents.map(event => {
      return {
        name: event.name,
        sport: event.sport,
        date: event.date,
      };
    }));

    // store data in db
    for (const event of sportEvents) {
      const foundEvent = await Event.findOne({ id: event.id });

      if (!foundEvent) {
        console.log("INSERT", event);
        const newEvent = new Event(event);

        await newEvent.save();
      }
    }

    // send info to server
    await axios({
      method: 'get',
      url: `${backendUrl}/api/allsportdb/notify?date=${startDate}`,
    });

  } catch (err) {
    console.error(err);
  }
});
