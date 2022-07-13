function run(argv) {
  const query = argv[0].replace(/(\p{sc=Han}+)/ug," ~\1 ");
  const app = Application("DEVONthink 3");
  app.activate();
  const r = app.inbox.root();
  const tw = app.openWindowFor({record: r} , {force: true});
  tw.searchQuery = query;
}
