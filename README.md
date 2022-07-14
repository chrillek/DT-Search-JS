# Alfred Workflow for DEVONthink 3

This workflow re-implements an older one also available on GitHub which depends on Python and other external tools. The new version only uses JavaScript, so that it doesn't depend on certain tools being installed.

It doesn't yet implement the global variables available in the older on to exclude a group or a list of databases. 

## Keyboard shortcuts

- DTD: select database for subsequent commands
- DTS: search in all databases or only the one selected by DTD
- DTSG: show all smart groups or only for the DB selected by DTD
- DTF: list favorites, **but not** databases, only groups and 
records
- DTWL: Load workspace
- DTWS: Save workspace
- DTT: Search for tags
- DTTS: Search with query in DT

## Result order

Results are returned in the following order
- Databases (DTD) alphabetically by name,
- Records (DTS, DTTS) first by database, than by ranking,
- Tags (DTT) alphabetically by name,
- Workspaces (DTWL) alphabetically by name,
- Smart groups first by database, than by name.