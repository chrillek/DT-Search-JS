'use strict';
ObjC.import('stdlib');

function run(argv) {
    // read environment variables
    console.log('ok')
    let env = $.NSProcessInfo.processInfo.environment;
    env = env.js;
    const selectedDB = 'selectedDbUuid' in env ? $.getenv('selectedDbUuid') : undefined;
    console.log(selectedDB)
    const filterOutGroup = 'filterGroup' in env ? $.getenv('filterOutGroup').toLowerCase() : undefined;
	  const ignoredDB = 'ignoredDbUuidList' in env ? 
		   $.getenv('ignoredDbUuidList').split(',').map(l => replace(/^\s+|\s+$/, '')) :
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

        const smartGroupList = db.smartGroups();
        smartGroupList.forEach(sg => {
            items.push({
                title:    sg.name(),
                subtitle: sg.name(),
                arg:      sg.uuid()
            });
        })
    })
    return JSON.stringify({items: (items.length > 0 ? 
      items.sort((a,b) => a.title - b.title) : 
      [{title: 'No SmartGroup …'}])
    })
}
