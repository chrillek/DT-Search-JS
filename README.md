# Alfred Workflow for DEVONthink 3

This workflow re-implements an older one also available on GitHub which depends on Python and other external tools. The new version only uses JavaScript, so that it doesn't depend on certain tools being installed.

It doesn't yet implement the global variables available in the older on to exclude a group or a list of databases. 

## Keyboard shortcuts

- <kbd>DTD</kbd> select database for subsequent commands,
- <kbd>DTS</kbd> search in all databases or only the one selected by DTD,
- <kbd>DTSG</kbd> show all smart groups or only for the DB selected by DTD,
- <kbd>DTF</kbd> list favorites. Databases in favorites currently not open will be opened by this command
- <kbd>DTWL</kbd> Load workspace,
- <kbd>DTWS</kbd> Save workspace,
- <kbd>DTTS</kbd>: Search with query in DT,
- <kbd>DTT</kbd> Search for tags. This is a shortcut to <kbd>DTS</kbd> with a query like "tags: t1 tags: t2".

## Result order

Results are returned in the following order
- Databases (<kbd>DTD</kbd>) alphabetically by name,
- Records (<kbd>DTS</kbd>, <kbd>DTTS</kbd>) first by database, than by ranking,
- Tags (<kbd>DTT</kbd>) alphabetically by name,
- Workspaces (<kbd>DTWL</kbd>) alphabetically by name,
- Smart groups (<kbd>DTSG</kbd>) first by database, than by name,
- Favorites (<kbd>DTF</kbd>) in the order shown in DEVONthink.