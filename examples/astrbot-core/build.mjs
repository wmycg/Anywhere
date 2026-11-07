import { readFile, writeFile } from 'node:fs/promises';

const directory = new URL('.', import.meta.url);
const model = JSON.parse(await readFile(new URL('model.json', directory), 'utf8'));
for (const filename of ['notes-events.json', 'notes-agent.json', 'notes-output.json']) {
  const notes = JSON.parse(await readFile(new URL(filename, directory), 'utf8'));
  for (const [id, detail] of Object.entries(notes)) {
    const node = model.nodes.find(item => item.id === id);
    if (!node) throw new Error(`Unknown node in ${filename}: ${id}`);
    if (node.explanation) throw new Error(`Duplicate node explanation: ${id}`);
    node.explanation = detail;
  }
}
const groupIds = new Set();
for (const group of model.groups) {
  if (groupIds.has(group.id)) throw new Error(`Duplicate group ID: ${group.id}`);
  groupIds.add(group.id);
}
const nodeIds = new Set();
for (const node of model.nodes) {
  if (nodeIds.has(node.id)) throw new Error(`Duplicate node ID: ${node.id}`);
  if (!groupIds.has(node.group)) throw new Error(`Node ${node.id} has an unknown group: ${node.group}`);
  nodeIds.add(node.id);
}
const edgeIds = new Set();
for (const edge of model.edges) {
  if (edgeIds.has(edge.id)) throw new Error(`Duplicate edge ID: ${edge.id}`);
  if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
    throw new Error(`Edge ${edge.id} has an unknown endpoint: ${edge.from} -> ${edge.to}`);
  }
  edgeIds.add(edge.id);
}
const template = await readFile(new URL('template.html', directory), 'utf8');
const embedded = JSON.stringify(model).replaceAll('<', '\\u003c');
if (!template.includes('/* MODEL_DATA */')) throw new Error('Model placeholder is missing');
await writeFile(new URL('index.html', directory), template.replace('/* MODEL_DATA */', embedded), 'utf8');
