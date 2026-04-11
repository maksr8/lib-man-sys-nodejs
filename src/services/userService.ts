import { AppError } from "../utils/AppError.js";
import { prisma } from "../db/prisma.js";
import type { SafeUser } from "../types/safeUser.js";
import cloudinary from "cloudinary";

export async function getAllUsers(): Promise<SafeUser[]> {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
}

export async function getUserById(id: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}

async function deleteAvatarFromCloud(avatarURL: string) {
  try {
    if (!avatarURL.includes("cloudinary.com")) return;
    const urlParts = avatarURL.split("/upload/");
    if (urlParts.length !== 2) return;
    let publicIdWithExt = urlParts[1];

    //Remove the version tag
    publicIdWithExt = publicIdWithExt!.replace(/^v\d+\//, "");

    // remove the file extension
    const publicId = publicIdWithExt.substring(
      0,
      publicIdWithExt.lastIndexOf("."),
    );

    console.log(`[Cloudinary] Attempting to delete: ${publicId}`);

    await cloudinary.v2.uploader.destroy(
      publicId,
      { invalidate: true },
      (error, _result) => {
        if (error) {
          console.error("Cloudinary deletion error:", error);
        } else {
          console.log(`[Cloudinary] Successfully deleted: ${publicId}`);
        }
      },
    );
  } catch (error) {
    console.error(
      "Failed to parse or delete old avatar from Cloudinary:",
      error,
    );
  }
}

export async function uploadAvatar(
  userId: string,
  file?: Express.Multer.File,
): Promise<string> {
  if (!file) {
    throw new AppError(
      400,
      "Did not receive a file. Please provide an image file in the 'avatar' field.",
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");

  if (user.avatarURL) {
    await deleteAvatarFromCloud(user.avatarURL);
  }

  const newAvatarURL = file.path;

  await prisma.user.update({
    where: { id: userId },
    data: { avatarURL: newAvatarURL },
  });

  return newAvatarURL;
}

export async function removeAvatar(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");

  if (!user.avatarURL) {
    throw new AppError(404, "Avatar not found.");
  }

  await deleteAvatarFromCloud(user.avatarURL);

  await prisma.user.update({
    where: { id: userId },
    data: { avatarURL: null },
  });
}
