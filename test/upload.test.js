const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { validateResumeFile } = require("../src/config/upload");

async function checkResume(contents) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pranam-resume-test-"));
  const filePath = path.join(directory, "resume.pdf");
  await fs.writeFile(filePath, contents);
  const req = { file: { path: filePath, filename: "resume.pdf" } };
  try {
    const error = await new Promise((resolve) => validateResumeFile(req, {}, resolve));
    return { directory, filePath, error };
  } catch (err) {
    await fs.rm(directory, { recursive: true, force: true });
    throw err;
  }
}

test("resume validation accepts a PDF signature and retains the private file", async () => {
  const result = await checkResume("%PDF-1.7\nresume");
  try {
    assert.equal(result.error, undefined);
    assert.equal((await fs.readFile(result.filePath)).subarray(0, 5).toString(), "%PDF-");
  } finally {
    await fs.rm(result.directory, { recursive: true, force: true });
  }
});

test("resume validation rejects and removes content that does not match its extension", async () => {
  const result = await checkResume("<html>not a PDF</html>");
  try {
    assert.equal(result.error.status, 400);
    await assert.rejects(fs.access(result.filePath), { code: "ENOENT" });
  } finally {
    await fs.rm(result.directory, { recursive: true, force: true });
  }
});
