    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import { Document, Types } from 'mongoose';
    import { MaterialType } from '../enums/material.enum';

    export type MaterialDocument = Material & Document;

    @Schema({ timestamps: true })
    export class Material {
    @Prop({ required: true })
    title: string;

    @Prop()
    sub: string;

    @Prop({ type: String, enum: MaterialType, default: MaterialType.PDF })
    type: MaterialType;

    @Prop()
    fileUrl: string;

    @Prop()
    filePublicId: string;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;
    }

    export const MaterialSchema = SchemaFactory.createForClass(Material);