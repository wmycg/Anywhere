import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('.', import.meta.url));
const read = async name => readFile(join(directory, name), 'utf8');
const model = JSON.parse(await read('model.json'));
const notes = new Map();
for (const file of ['notes-events.json', 'notes-agent.json', 'notes-output.json']) {
  for (const [id, explanation] of Object.entries(JSON.parse(await read(file)))) {
    assert(!notes.has(id), `Duplicate explanation: ${id}`);
    notes.set(id, explanation);
  }
}

test('all nodes and relationships have valid identities and endpoints', () => {
  const nodes = new Set(model.nodes.map(node => node.id));
  const groups = new Set(model.groups.map(group => group.id));
  const edges = new Set(model.edges.map(edge => edge.id));
  assert.equal(nodes.size, model.nodes.length);
  assert.equal(groups.size, model.groups.length);
  assert.equal(edges.size, model.edges.length);
  assert.equal(nodes.size, 90);
  assert.equal(edges.size, 139);
  for (const node of model.nodes) assert(groups.has(node.group), node.id);
  for (const edge of model.edges) {
    assert(nodes.has(edge.from) && nodes.has(edge.to), edge.id);
    assert(edge.details?.steps?.length && edge.details?.dataFlow?.length && edge.details?.sources?.length, edge.id);
  }
});

test('each node has an evidenced explanation', () => {
  assert.equal(notes.size, model.nodes.length);
  for (const node of model.nodes) {
    const explanation = notes.get(node.id);
    assert(explanation?.role && explanation.logic?.length && explanation.data?.length && explanation.sources?.length, node.id);
  }
});

test('key routing and tool relationships remain represented', () => {
  const hasEdge = (from, to, kind) => model.edges.some(edge => edge.from === from && edge.to === to && edge.kind === kind);
  assert(hasEdge('EventBus', 'AstrBotConfigManager', 'routes'));
  assert(hasEdge('EventBus', 'PipelineScheduler', 'routes'));
  assert(hasEdge('FunctionToolManager', 'MCPTool', 'wraps'));
  assert(hasEdge('MCPTool', 'FunctionTool', 'inherits'));
});

test('generated HTML matches the template and data', async () => {
  for (const node of model.nodes) node.explanation = notes.get(node.id);
  const embedded = JSON.stringify(model).replaceAll('<', '\\u003c');
  const expected = (await read('template.html')).replace('/* MODEL_DATA */', embedded);
  assert.equal(await read('index.html'), expected);
});

test('optional AstrBot checkout contains referenced source ranges', { skip: !process.env.ASTRBOT_SOURCE }, async () => {
  const source = process.env.ASTRBOT_SOURCE;
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
  assert.equal(revision, model.revision, 'AstrBot checkout must match the sample revision');
  const lineCounts = new Map();
  const sources = [...model.nodes.flatMap(node => node.sources ?? []), ...model.edges.flatMap(edge => edge.details?.sources ?? []), ...[...notes.values()].flatMap(note => note.sources ?? [])];
  for (const [path, start, end] of sources) {
    assert(!path.startsWith('/') && !path.split('/').includes('..'), path);
    if (!lineCounts.has(path)) lineCounts.set(path, (await readFile(join(source, path), 'utf8')).split(/\r?\n/).length);
    assert(start >= 1 && (end ?? start) >= start && (end ?? start) <= lineCounts.get(path), `${path}:${start}-${end}`);
  }
});
