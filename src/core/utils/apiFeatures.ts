import { Query } from "mongoose";

class APIFeatures<T> {
  query: Query<T[], T>;
  queryString: any;

  constructor(query: Query<T[], T>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludeFilters = ["fields", "sort", "limit", "page"];
    excludeFilters.forEach((el: string) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortQuery = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortQuery);
    } else {
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsQuery = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldsQuery);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
