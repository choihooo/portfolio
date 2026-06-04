import assert from "node:assert/strict";
import { getCommandMetadata } from "../src/commands/registry";
import { help } from "../src/commands/help";
import { projectsHandler } from "../src/commands/projects";

function getOutput(value: Awaited<ReturnType<typeof help>>): string {
  assert("output" in value && typeof value.output === "string");
  return value.output;
}

async function main() {
  const helpOutput = getOutput(await help({ args: [], rawInput: "help" }));
  for (const command of getCommandMetadata()) {
    assert(
      helpOutput.includes(`/${command.name}`),
      `/help must include /${command.name}`
    );

    for (const example of command.examples ?? []) {
      const [rawCommand] = example.replace(/^\//, "").split(/\s+/);
      assert(
        getCommandMetadata().some((meta) => meta.name === rawCommand),
        `metadata example references unknown command: ${example}`
      );
    }
  }

  const studyAdmin = getOutput(
    await projectsHandler({
      args: ["study-admin-recommendation"],
      rawInput: "projects study-admin-recommendation",
    })
  );
  assert(!studyAdmin.includes("Project not found"), "canonical study-admin slug should resolve");
  assert(studyAdmin.includes("study-admin 맞춤 추천 시스템"));

  const hods = getOutput(
    await projectsHandler({
      args: ["hods-design-system"],
      rawInput: "projects hods-design-system",
    })
  );
  assert(!hods.includes("Project not found"), "canonical HODS slug should resolve");
  assert(hods.includes("HODS 멀티플랫폼 디자인 시스템"));

  const bugi = getOutput(
    await projectsHandler({
      args: ["bugi-download"],
      rawInput: "projects bugi-download",
    })
  );
  assert(bugi.includes("https://choihooo.github.io/bugi-download/"));
  assert(bugi.includes("https://github.com/kusitms-bugi/FE"));

  console.log("Command behavior ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
