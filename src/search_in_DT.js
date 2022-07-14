/* Search in the currently selected db (if 'selectedDbUUID' is set) or all databases
   using the query passed in as the first argument */

ObjC.import('Foundation');

function run(argv) {
  const query = (argv && argv[0]) ? argv[0] : "";
  const dbUUID = (() => {
    const db = $.NSProcessInfo.processInfo.environment.js['selectedDbUUID'];
    return db ? db.js : undefined;
  })();
  const app = Application("DEVONthink 3");
  var databases = [];
  if (dbUUID && dbUUID.length > 0) {
	  databases.push(app.getDatabaseWithUuid(dbUUID));
  } else {
    databases = [...app.databases()];
  }
  const resultArray = [];
  
 databases.forEach((db) => {
        // search in record corresponding to the database

/*    const resultList = (databases.length > 0 ? 
        app.search(query, { in: db.root()}) :
        app.search(query));
    */
    const resultList = app.search(query, {in: db.root()});
    resultList.forEach(record => {
      const item = {}
      const itemName = record.name();
      const itemScore = record.score();
      const itemTags = record.tags();
      const itemPath = record.path();
      const itemUUID = record.uuid();

      let itemLocation = record.location()
      if (itemLocation.length > 1) {
         itemLocation = itemLocation.slice(0, -1).replace(/\//g, " > ")
       } else {
         itemLocation = ""
       }

       item.type = "file:skipcheck";
       item.title = itemName;
       item.arg = itemPath;
   	   item.score = itemScore;
       item.subtitle = `📂 ${record.database.name()} ${itemLocation}`;
       item.icon = { "type": "fileicon", "path": itemPath };

	   const itemTagStr = itemTags.length > 0 ? itemTags.join(", ") : "No Tags";

       item.mods = {
           cmd: { valid: true, arg: itemUUID, subtitle: `🏷 ${itemTagStr}`},
           alt: { valid: true, arg: itemUUID, subtitle: "Reveal in DEVONthink" },
           "cmd+alt": { valid: true, arg: query, subtitle: "Search in DEVONthink App" },
           shift: {valid: true, arg: `[${itemName}](x-devonthink-item://${itemUUID})`,    
                     subtitle: "Copy Markdown Link"}
            };
       item.text = {copy: `x-devonthink-item://${itemUUID}`,
                    largetype: `x-devonthink-item://${itemUUID}`
            };
       item.quicklookurl = itemPath;

	   resultArray.push(item);
     }) /* forEach */
  }) /* databases.forEach */
  resultArray.sort((a,b) => b.score - a.score);
  const result = resultArray.length ? JSON.stringify({ "items": resultArray }): 
       JSON.stringify({ "items": [{ "title": "No document..." }] });
  return result;
}
