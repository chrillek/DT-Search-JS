ObjC.import('stdlib');

function run(argv) {
  const dbUUID = $.getenv('selectedDbUUID');
  const app = Application("DEVONthink 3");
  const db = app.getDatabaseWithUuid(dbUUID);
  const tags = db.tagGroups.name();
  const items = tags.sort().map(t => {
    return {title: t, subtitle: 'Press enter to list all files with this tag',
            variables: {selectedTag: t, selectedDbUUID: dbUUID}}
    });
  return items && items.length > 0 ? 
     JSON.stringify({'items': items}) :
     JSON.stringify({"items": [{title: "No Tags"}]});
}
