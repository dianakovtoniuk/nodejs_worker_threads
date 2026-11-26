import fs from "node:fs/promises";

// Delete a file if exits, if not the function will not throw an error
export const deleteFile = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch {
    // do nothing
  }
};

// Delete a folder if exits, if not the function will not throw an error
export const deleteFolder = async (path: string): Promise<void> => {
  try {
    await fs.rm(path, { recursive: true });
  } catch {
    // do nothing
  }
};
