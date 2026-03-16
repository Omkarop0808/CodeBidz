import mongoose from "mongoose";

const creditLedgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["assigned", "deducted", "returned", "won"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

creditLedgerSchema.index({ userId: 1, createdAt: -1 });
creditLedgerSchema.index({ auctionId: 1 });

const CreditLedger = mongoose.model("CreditLedger", creditLedgerSchema);
export default CreditLedger;
