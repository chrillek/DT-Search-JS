function run(argv) {
    var query = argv[0];
    const DNt = Application('DEVONthink 3');
	DNt.activate()
    DNt.openWindowFor({ record: DNt.getRecordWithUuid(query) })
}
