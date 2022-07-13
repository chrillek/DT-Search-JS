function run(argv) {
  const dbName = "{query}";
  const app = Application("DEVONthink 3");
  const names = app.databases.name().sort();
  const items = names.map((n) => {
    const uuid = app.databases[n].uuid();
    return {
	  title: n, 
       arg: "",
       type: 'file',
	   variables:  { "selectedDbUUID":  uuid , "selectedDbName": n },
     } 
  })
  return JSON.stringify({items: items});
}
