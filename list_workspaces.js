function run() {
  app = Application("DEVONthink 3");
  workspaces = app.workspaces();
  const items = [];
  workspaces.forEach(w => 
    items.push({title: w, subtitle:'', arg: w})
  )
  return JSON.stringify({items: (items.length > 0 ?
    items :
	[{title: 'No workspaces', subtitle: "(*´･д･)?"}]
  )});
}
