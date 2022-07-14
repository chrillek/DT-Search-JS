ObjC.import('stdlib');

function run(argv) {
   const dbUUID = $.getenv('selectedDbUUID');
   const tag = $.getenv('selectedTag');
   const app = Application("DEVONthink 3");
   const db = app.getDatabaseWithUuid(dbUUID);
   const records = app.search(`tags: ${tag}`, {in: db});
   const items = [];
   records.forEach(r => {
     const uuid = r.uuid();
     const path = r.path();
     const loc =  r.location().replace(/\/$/," > ");
     items.push({type: 'file',
                 title: r.name(),
				subtitle: `📂 ${r.database.name()} ${loc}`,
				arg: path,
				icon: {type: "fileicon", path: path},
                 mods: {
                  cmd: {valid: true, arg: uuid, subtitle: `🏷  ${r.tags().join(', ')}`},
                  alt: {valid: true, arg: uuid, subtitle: "Reveal in DEVONthink"},
                  shift: {valid: true, arg: `[${r.name()}](x-devonthink-item://${uuid})`,
                         subtitle: "Copy Markdown Link"},
                },
                text: {
                  copy: `x-devonthink-item://${uuid}`,
                  largetype: `x-devonthink-item://${uuid}`
                },
			   quicklookurl: path 
      }); /* items.push */
   })
   return items.length > 0 ? 
     JSON.stringify({items: items}) : 
     JSON.stringify({items: [{title: "No record with these tags"}]});
}
