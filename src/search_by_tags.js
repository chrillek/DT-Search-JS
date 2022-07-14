"use strict";
ObjC.import('stdlib');

function run(argv) {
  const tags = argv[0].split(/[,;]\s*/).filter(t => !/^$/.test(t)).map(t => `tags: ${t} `).join('');
  const env = $.NSProcessInfo.processInfo.environment.js;
  const ignoredDBList = 'ignoredDbUuidList' in env ? 
      env['ignoredDbUuidList'].split(",").filter(t => !/^$/.test(t)) : 
      undefined;

  const app = Application("DEVONthink 3");
  const items = [];
  app.databases().filter(d => ! (ignoredDBList && d.uuid() in ignoredDBList)).forEach(db => {
    const result = app.search(tags, {in: db.root()});
    result.forEach(r => {
      const uuid = r.uuid();
      const path = r.path();
      const loc  = r.location();

      items.push({
        type: 'file',
        title: r.name(),
		    subtitle: `📂 ${db.name()} ${loc}`,
		    arg: path,
		    icon: {type: "fileicon", path: path},
        mods: {
                cmd: {valid: true, arg: uuid, subtitle: `🏷  ${r.tags().join(', ')}`},
                alt: {valid: true, arg: uuid, subtitle: "Reveal in DEVONthink"},
                shift: {valid: true, arg: `[${r.name()}](x-devonthink-item://${uuid})`,
                subtitle: "Copy Markdown Link"}
         },
         text: {
             copy: `x-devonthink-item://${uuid}`,
             largetype: `x-devonthink-item://${uuid}`
         },
    	     quicklookurl: path 
      })
    })
  })
  return JSON.stringify({items: (items.length > 0) ? 
     items :
     [{title: "No Tags"}]
   });
}
