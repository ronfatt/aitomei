import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "请填写名字。"),
  lastName: z.string().min(2, "请填写姓氏。"),
  displayName: z.string().min(2, "请填写显示名称。"),
  mobileNumber: z.string().min(8, "请输入有效的手机号码。"),
  preferredTone: z.string().min(3, "请填写偏好的内容语气。"),
  favoriteCategory: z.string().min(3, "请填写偏好的产品类别。"),
  bio: z.string().min(24, "请填写一段简短的会员介绍。"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const defaultProfileValues: ProfileFormValues = {
  firstName: "Nur",
  lastName: "Amirah",
  displayName: "Nur Amirah",
  mobileNumber: "+60 12-345 6789",
  preferredTone: "优雅且具教育感",
  favoriteCategory: "黄金送礼",
  bio: "我喜欢创作优雅的社媒内容，也乐于帮助身边的人发现适合作为礼物的珠宝系列。",
};
