import { CommandExitError } from "e2b";

export async function runBash(sandbox, command, REPO_PATH) {
  try {
    const result = await sandbox.commands.run(command, {
      cwd: REPO_PATH,
    });

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (err) {
    if (err instanceof CommandExitError) {
      return {
        exitCode: err.exitCode,
        stdout: err.stdout,
        stderr: err.stderr,
      };
    }

    throw err;
  }
}

export async function readFile(sandbox, path) {
  try {
    const content = await sandbox.files.read(path);

    return {
      exitCode: 0,
      stdout: content,
      stderr: "",
    };
  } catch (err) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: String(err),
    };
  }
}

export async function editFile(sandbox, path, content) {
  try {
    await sandbox.files.write(path, content);

    return {
      exitCode: 0,
      stdout: `Successfully updated ${path}`,
      stderr: "",
    };
  } catch (err) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: String(err),
    };
  }
}
