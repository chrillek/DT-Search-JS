function run(argv) {
	const workspace = argv[0];
    const app = Application("DEVONthink 3");
    app.loadWorkspace(workspace);
    app.activate()
}
