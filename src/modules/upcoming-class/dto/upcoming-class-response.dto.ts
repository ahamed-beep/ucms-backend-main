import { Expose } from "class-transformer";
import { ClassMode, ClassStatus, ClassType } from "../enums/upcoming-class.enums";

export class UpcomingClassResponseDto {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() date: Date;
  @Expose() totalSpots: number;
  @Expose() spotsLeft: number;
  @Expose() type: ClassType;
  @Expose() mode: ClassMode;
  @Expose() location: string;
  @Expose() instructor: string;
  @Expose() status: ClassStatus;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}