'use strict';
ObjC.import('Foundation');

/* List all smart groups for either the db passed in the environment variable selectedDbUuid or all databases */
function run(argv) {
  // read environment variables for selectedDbUuid, filterGroup and ignoredDbUuidList
  
  const env = $.NSProcessInfo.processInfo.environment.js;
  const selectedDB = 'selectedDbUuid' in env ? env['selectedDbUuid'] : undefined;
  const filterOutGroup = 'filterGroup' in env ? env['filterOutGroup'].toLowerCase() : undefined;
  const ignoredDB = 'ignoredDbUuidList' in env ? 
  env['ignoredDbUuidList'].split(',').map(l => replace(/^\s+|\s+$/, '')) :
  undefined;
  
  const app = Application("DEVONthink 3");
  const dbs = selectedDB ? 
    [app.getDatabaseWithUuid(selectedDB)] :
    app.databases();
  
  const items = []
  
  dbs.forEach(db => {
    const dbUUID = db.uuid();
    
    // if selectedDbUUID not exists and theDbUUID in ignoredDbUuidList, ignore the db
    if (! selectedDB && (ignoredDB  && ignoredDB.includes(dbuuid))) {
      return;
    }
    
    const smartGroupList = db.smartGroups().sort((a,b) => (a.name() > b.name() ? 1 : (a.name() < b.name() ? -1 : 0)));
    smartGroupList.forEach(sg => {
      items.push({
        title:    sg.name(),
        subtitle: db.name(),
        arg:      sg.uuid()
      });
    })
  })
  return JSON.stringify({items: (items.length > 0 ? 
    //items.sort((a,b) => (a.title > b.title ? 1 : (a.title < b.title ? -1 : 0) )) :
    items : 
    [{title: 'No SmartGroup …'}])
  })
}
