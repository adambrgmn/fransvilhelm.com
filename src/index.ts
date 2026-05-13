// import { Resource } from "sst";

export default {
  async fetch() {
    // const row = await Resource.MyDatabase.prepare(
    //   "SELECT id FROM todo ORDER BY id DESC LIMIT 1",
    // ).first();

    // return Response.json(row);
    return Response.json({ success: true })
  },
};
