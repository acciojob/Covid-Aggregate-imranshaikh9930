const { Schema } = require("mongoose");

const tallySchema = new Schema({
  state: Schema.Types.String,
  infected: Schema.Types.Number,
  recovered: Schema.Types.Number,
  death: Schema.Types.Number,
});

module.exports = { tallySchema };
