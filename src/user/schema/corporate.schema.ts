import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Corporate extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  businessType: string;

  @Prop({ required: true, unique: true })
  companyEmail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  incorporationDate: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken: string | null;
}

export const CorporateSchema = SchemaFactory.createForClass(Corporate);
