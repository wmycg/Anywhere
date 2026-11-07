---
name: codebase-relationship-map
description: "Build a source-backed, navigable map of a repository's runtime flow, code entities, data models, and external boundaries. Use when a reader asks for a detailed code-flow or architecture graph to follow source across modules."
---

# Codebase Relationship Map

Create a repository-grounded map that lets a reader move from a requested runtime flow to the classes, functions, methods, data wrappers, and external systems that actually participate in it. Optimize for source comprehension: the reader should be able to follow a node or relationship back into code without guessing where an object came from or who consumes it.

For a requested interactive map, use standalone HTML by default; respect a different requested output format. Choose a tree, layered graph, swimlane graph, or another layout from the repository's actual relationships; do not force a tree when it would duplicate symbols or hide cross-module dependencies. A request for a textual explanation alone does not require an HTML artifact.

## Investigation

1. Establish the repository, requested feature or execution path, and relevant source revision. Read local project instructions first. Inspect the working tree before editing; never overwrite unrelated user changes. If source files are modified, state whether the map describes the checked-out revision, the working tree, or both.
2. Start at the user-visible entry point and trace real calls and data in both directions: inputs and their producers, control flow, decisions, state changes, returns, side effects, and downstream consumers. Follow each call through the concrete implementations and wrappers needed to explain the behavior. Search the source and inspect definitions; names, comments, and directory layout alone are not proof.
3. Add an intermediate component whenever the runtime path depends on it, regardless of its architectural label. This can be a middleware, event queue, dispatcher, context object, registry, scheduler, adapter, plugin hook, transaction, serializer, cache, broker, or another project-specific mechanism. Do not assume a project has any particular component.
4. Separate construction and initialization from the main runtime path when they materially obscure it. Show where important dependencies and configuration come from in the runtime map, then use a separate view for their construction, registration, loading, or lifecycle order. Do not expand every subsystem's initialization merely because it exists.
5. Keep scope explicit. Account for the project-defined classes and methods crossed by each traced in-scope path, including intermediate wrappers and behavior-changing branches; a method can be described in its class or relationship details without becoming a node. Do not impose an arbitrary node or word limit. Stop at the agreed scope, language primitives, and external boundaries rather than enumerating an entire repository unless asked. Use representative implementations for families of interchangeable adapters or providers when sufficient, and mark them as examples rather than exhaustive lists. Identify unresolved dynamic dispatch or other paths that could not be verified.

## Nodes And Identity

Represent each distinct source entity once. Assign stable IDs using qualified module and symbol names so same-named classes in different packages are not merged. A symbol may be reached from many relationships, but must not be duplicated to make the layout look like a tree.

Include the kinds of nodes that the traced flow actually needs:

- Classes, interfaces, abstract bases, and concrete implementations.
- Standalone functions when they create, transform, validate, route, or persist important data. A function such as a request builder can be a first-class node; describe its inputs, return shape, and consumers.
- Data models and important ephemeral wrappers, such as request/response envelopes, event objects, context wrappers, result chains, or database records. Explain how they differ when similar names conceal different responsibilities.
- External boundaries and data sources when they provide or receive data: databases and files, configuration stores, APIs, message platforms, queues, brokers, subprocesses, and third-party services. Label these as external or conceptual boundaries, not as source-code classes. Only include sources supported by the traced code.

Keep ordinary methods on their owning class node unless promoting a specific method clarifies an important transformation or control transition. If a method is promoted, connect both its owning class or caller and its returned data or consumer, then avoid presenting it twice as an unrelated operation. For source nodes, give a concise role, source file, and useful fields and methods with short explanations of their meaning or use. For external boundaries, describe the relevant inputs or outputs and reference the integration code rather than inventing a source definition. Do not list an unverified field or method.

Abstract bases are useful nodes when callers depend on their contracts. Clearly distinguish the contract from runtime behavior: connect representative concrete implementations and show which implementation performs protocol conversion, I/O, or other concrete work. Do not imply that an abstract base performs behavior implemented by a subclass. Avoid listing every interchangeable implementation unless the user asks for exhaustive coverage.

## Node Explanations

Make the node detail useful as a self-contained starting point for reading its source, not just a list of names. In the reader's language, explain the node's purpose in the overall flow and its scope of responsibility. For important nodes, trace the relevant entry points in execution order: who triggers them, the inputs and significant fields, decisions or delegated work, side effects, returned or produced data, and the next consumer. Explain non-obvious terms and distinguish similar objects, contracts from implementations, and construction from runtime behavior when relevant. Give precise source locations for each substantive explanation and mark unresolved behavior as unknown.

Make incoming and outgoing relationships discoverable from the node detail, with their actual semantics and access to the existing relationship explanations. Where a relationship contains essential information, let the reader inspect its trigger, method sequence, data transformations and result without losing the node context. For data models and external boundaries, explain their origin, significant fields or payloads, lifetime and consumers as supported by source rather than inventing execution steps. Describe key fields and methods in terms of their role and use; omit irrelevant headings instead of filling them with boilerplate. Scale detail to the symbol's complexity and the requested scope, and clearly indicate which parts have not been traced.

## Relationships And Data

Give each relationship a direction and a truthful meaning: calls, constructs, returns, inherits, implements, owns, routes, reads, writes, sends, receives, wraps, consumes, or another precise relation. Do not use a single generic arrow for incompatible meanings. Label whether a path is a direct call or passes through a queue, scheduler, registry, context, callback, or other intermediate component.

Make each relationship inspectable, whether selected from an arrow or a relationship list. Its detail should explain, as applicable:

- What event, condition, or caller triggers the relationship.
- The ordered method calls, including intermediate calls that are not nodes.
- The concrete type before and after each important boundary.
- How data is parsed, normalized, wrapped, copied, merged, serialized, or persisted. Name important fields and distinguish separate objects that are often conflated.
- Branches, validation, errors, retries, early exits, and streaming or asynchronous behavior that change the path.
- Which component consumes the result and what it does next.
- Source paths and precise line references for the behavior.

Model data creation explicitly when a later object would otherwise appear from nowhere. Connect the producing method to the produced model, then to its consumer. For example, follow a stored record through the transformations actually performed before connecting it to an application request; do not draw a direct storage-to-request arrow if real transformations intervene. Distinguish similarly named input, internal, and output models whenever the code wraps them separately.

## Layout And Interaction

Arrange nodes around the actual flow and relationships. Group by responsibilities, runtime stages, or meaningful boundaries; use cross-group arrows where the code crosses boundaries. Make side paths and important alternatives visible without turning the central path into an unreadable knot. Use a separate initialization view when construction obscures runtime behavior.

For large maps, use progressive exploration rather than shrinking the whole diagram until labels are unreadable. Provide practical navigation such as search, grouping or filtering, zoom and pan, a searchable relationship list, and a detail panel for selected nodes and edges. Every relationship must remain discoverable even when lines overlap, are filtered, or are difficult to click. Keep node and edge identity stable when filters change.

Give the most important runtime nodes a distinct but restrained visual treatment and explain the emphasis in a legend. Give external boundaries a separate recognizable treatment. Do not rely on color alone: include a text label or shape difference. Keep the full details readable in the panel; avoid packing method descriptions onto tiny node cards. Preserve keyboard access and mobile usability. Dragging the canvas must not select diagram text, while text in detail panels should remain selectable.

## Evidence And Validation

Use the repository's own source as the authority for code-backed claims. Attach evidence to nodes and relationships, and prefer narrow line ranges covering the relevant definition or call. Do not present inferred architecture as fact; label an inference and cite the code path supporting it. Do not invent class members, API contracts, data fields, or external behavior. When a third-party system's internals are outside the repository, show the boundary and the payload the project sends or receives, not guessed internals.

Before delivery, check that:

- Each depicted source symbol has one node, IDs are unique, and every edge endpoint exists; methods described on a class or edge need not also be separate nodes.
- Important nodes are connected to the flow, or explicitly marked as context that is outside the traced path; no unexplained orphan nodes remain.
- The main path reaches its real output or side effect, and major alternate paths are represented.
- Important input and output sources, persistent state, configuration, and external APIs are present when the traced flow uses them.
- Relationship directions distinguish calls from data returns, and direct calls from indirect scheduling or messaging.
- Data wrappers and conversion steps line up with source definitions, including exact return shapes for promoted functions.
- Node details explain the purpose and relevant behavior of important symbols, surface incoming and outgoing relationship details, and distinguish verified facts from gaps.
- Source paths and line references exist in the stated revision.
- The default view is readable at normal desktop size; search, filtering, edge details, pan/zoom, keyboard use, and a narrow mobile viewport work. Use a real browser when available. If a check cannot be performed, say so rather than claiming it passed.

Report the scope and any deliberate omissions plainly. Never claim to cover every class, provider, adapter, or module unless that scope was actually searched and checked. Deliver the artifact link first, followed by a short note describing how to explore it and any source-version caveat.
