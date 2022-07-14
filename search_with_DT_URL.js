function run(argv) {
  var query = argv[0].replace(/(\p{sc=Han}+)/ug," ~\1 ");
  var app = Application.currentApplication();
  app.includeStandardAdditions = true;
  app.doShellScript(`open 'x-devonthink://search?query=${encodeURIComponent(query)}'`);
}
