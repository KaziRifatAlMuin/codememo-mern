import mongoose from "mongoose"

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
  },
  { timestamps: true }
)

tagSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema)

export default Tag
