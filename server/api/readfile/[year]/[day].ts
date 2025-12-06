// server/api/read-file.js

export default defineEventHandler(async (event) => {
  const { year, day } = event.context.params as { year: string; day: string };
  const fileContent = await Bun.file(
    `/inputExample\\${year}\\day${day}.txt`
  ).text();
  try {
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read file on server",
    });
  }
});
