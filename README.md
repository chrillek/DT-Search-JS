# Alfred Workflow for DEVONthink 3

This workflow re-implements an older one also available on GitHub which depends on Python and other external tools. The new version only uses JavaScript, so that it doesn't depend on certain tools being installed.

It doesn't yet implement the global variables available in the previous workflow to exclude a group or a list of databases. 

## Keyboard shortcuts

- <kbd>DTD</kbd> select database for subsequent commands,
  - <kbd>Enter</kbd>: search in this database
  - <kbd>Opt-Enter</kbd>: show all smart groups for this database
  - <kbd>Cmd-Enter</kbd>: show all tags for this database
  - <kbd>Ctrl-Enter</kbd>: show all groups for this database (excluding Tags and Trash)
- <kbd>DTS</kbd>: search in all databases,
  - <kbd>Enter</kbd>: open in default program
  - <kbd>Cmd+Enter</kbd>: open in DEVONthink
  - <kbd>Opt+Enter</kbd>: reveal in DEVONthink
- <kbd>DTSG</kbd> show all smart groups,
- <kbd>DTF</kbd> list favorites. Databases in favorites currently not open will be opened by this command
- <kbd>DTWL</kbd> Load workspace,
- <kbd>DTWS</kbd> Save workspace,
- <kbd>DTTS</kbd>: Search with query in DT,
- <kbd>DTT</kbd> Search for tags. This is a shortcut for <kbd>DTS</kbd> with a query like "tags: t1 tags: t2". Enter the tags separated by commas or semicolons.

## Limit search to group

To limit the search to a certain group, you must
- select a database (<kbd>DTD</kbd>)
- get its groups (<kbd>Ctrl-Enter</kbd>)
- select one of the groups and open the search with <kbd>Cmd-Enter</kbd>
## Result order

Results are returned in the following order
- Databases (<kbd>DTD</kbd>) alphabetically by name,
- Records (<kbd>DTS</kbd>, <kbd>DTTS</kbd>) first by database, than by ranking,
- Tags (<kbd>DTT</kbd>) alphabetically by name,
- Workspaces (<kbd>DTWL</kbd>) alphabetically by name,
- Smart groups (<kbd>DTSG</kbd>) first by database, than by name,
- Favorites (<kbd>DTF</kbd>) in the order shown in DEVONthink.