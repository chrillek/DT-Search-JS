/* One single source to handle all DEVONthink related stuff */
"use strict;";
ObjC.import("Foundation");

/* Mapping from command names to functions in this file */

const cmdMap = {
  list_databases: listDatabases /* DTD, select_DB */,
  list_smartgroups: listSmartgroups /* DTSG, list_all_smartgroups */,
  list_tags: listTags /* DTT, list_all_tags */,
  list_favorites: listFavorites /* DTF, list_favorites */,
  list_workspaces: listWorkspaces /* DTLW, list_workspaces */,
  search_for_alfred:
    searchForAlfred /* DTS, search_by_tags with query. This returns the results from DT to Alfred */,
  open_record: openRecord /* open_with_DT, expects UUID */,
  records_with_tag: recordsWithTag /*  with tag passed as parameter */,
  search_in_dt:
    searchInDT /* search_with_DT_URL, search_in_new_window. This runs the query in DT and populates the result window there  */,
  load_workspace: loadWorkspace /* load_workspace */,
  save_workspace: saveWorkspace /* save_workspace */,
  list_searches:  listSearches /* list the last 10 searches (should the no. be configurable?) */,
};

const app = Application("DEVONthink 3");
const searchFile = 'searches.json';
const error = $();
const savedSearches = loadSearches();

/* get curApp object for shell commands */
const curApp = Application.currentApplication();
curApp.includeStandardAdditions = true;

function loadSearches() {
  const string = $.NSString.stringWithContentsOfFileEncodingError($(searchFile),$.NSUTF8StringEncoding, error);
  if (string && string.js) {
    return JSON.parse(string.js);
  } else {
    return [];
  }
}

function saveSearches() {
 // console.log(`Saving ...${savedSearches}`);
  const string = $(JSON.stringify(savedSearches));
  string.writeToFileAtomicallyEncodingError($(searchFile), false, $.NSUTF8StringEncoding, error);
}

/* Get an environment variable and return its value as JS string or undefined if it doesn't exist */
function getEnv(name) {
  const env = $.NSProcessInfo.processInfo.environment.js;
  return name in env ? env[name].js : undefined;
}

function getIgnoredDBs() {
  const ignoredDBList = getEnv("ignoredDbUuidList");
  return ignoredDBList
    ? /* Split the list at commas and weed out empty entries */
      ignoredDBList
        .split(",")
        .filter((t) => !/^$/.test(t))
        .map((t) => t.trim())
    : [];
}

/* Return the DB defined in the preceding action. If 'all' is true, return an array containing all databases, 
   excluding those in 'ignoredDbUuidList' */
function getDB(all) {
  const DB = getEnv("selectedDbUUID");
  //  console.log(`DB ${DB}`);
  if (all) {
    const ignoredDB = getIgnoredDBs();
    return (DB ? [app.getDatabaseWithUuid(DB)] : [...app.databases()]).filter(
      (uuid) => !ignoredDB.includes(uuid)
    );
  } else {
    return app.getDatabaseWithUuid(DB);
  }
}

/* Build tag string for subtitles */
function tagString(tags) {
  return tags.length > 0 ? tags.join(", ") : "no tags";
}

/* check if the argument is an array with at least one empty element */
function checkArg(arg) {
  const caller = arguments.callee.caller.name;
  if (typeof arg !== "object") {
    throw `"${caller}" not called with an array`;
  }
  if (!arg.length) {
    throw `"${caller}" called with empty argument array`;
  }
  if (!arg[0].length) {
    throw `"${caller}" called with empty argument`;
  }
  return arg[0];
}

function run(arg) {
  const cmd = checkArg(arg);
  /* Basic error checking */
  if (!cmd) return `{items: [Title: 'No command!']}`;
  const cmdHandler = cmdMap[cmd];
  if (!cmdHandler) return `{items: [Title: 'No cmdHandler for "${cmd}"!']}`;
  /* Call the command handler with the remaining arguments */
  const result = cmdHandler(arg.slice(1));
  return result ? JSON.stringify({ items: result }) : undefined;
}

/* List all tags for the currently defined database */
function listTags() {
  const db = getDB(false);
  const dbUUID = db.uuid();
  // console.log(`db ${db.name()}`);
  const tags = db.tagGroups.name();
  const items = tags.sort().map((t) => {
    return {
      title: t,
      subtitle: "Press enter to list all files with this tag",
      variables: {
        selectedTag: t,
        selectedDbUUID: dbUUID,
      },
    };
  });
  return items.length ? items : [{ title: "No tags" }];
}

/* Search in the currently defined database (or all of them if that's not defined) using the query passed in */
function searchForAlfred(arg) {
  let query = checkArg(arg);
  if (arg.length > 1) {
    /* search for tags: Split the tags passed in at , and ;
       build a query like "tags: tag1 tags: tag2" etc. */
    query = arg[1]
      .split(/[,;]\s*/)
      .filter((t) => !/^$/.test(t))
      .map((t) => `tags: ${t} `)
      .join("");
    console.log(query);
    //    curApp.displayAlert(`"${query}"`);
  }
  const databases = getDB(true); /* Array with all databases to search */
  const resultArray = [{ query: query }];
  savedSearches.push({q: query, db: (databases.length > 1 ? undefined : databases[0])});
  if (savedSearches.length > 10) {
    savedSearches.shift();
  }
  saveSearches();

  databases.forEach(db => {
    // search in record corresponding to the database
    const resultList = app.search(query, { in: db.root() });

    resultList.forEach(record => {
      const uuid = record.uuid();
      const location = (() => {
        const loc = record.location();
        if (loc.length > 1) {
          return loc.slice(0, -1).replace(/\//g, " > ");
        } else {
          return "";
        }
      })();

      const tagStr = tagString(record.tags());
      const dtLink = `x-devonthink-item://${uuid}`;
      const name = record.name();
      const path = record.path();
      resultArray.push({
        type: "file:skipcheck",
        title: name,
        score: record.score(),
        tags: tagStr,
        arg: path /* To open in default editor */,
        subtitle: `📂 ${db.name()}: ${location}`,
        icon: { type: "fileicon", path: path },
        mods: {
          cmd: { valid: true, arg: uuid, subtitle: `🏷 ${tagStr}` },
          alt: { valid: true, arg: uuid, subtitle: "Reveal in DEVONthink" },
          shift: {
            valid: true,
            arg: `[${name}](${dtLink})`,
            subtitle: "Copy Markdown Link",
          },
        },
        text: {
          copy: `${dtLink}`,
          largetype: `${dtLink}`,
        },
        quicklookurl: path,
      });
    }); /* forEach */
  }); /* databases.forEach */
  resultArray.sort((a, b) => b.score - a.score);
  return resultArray.length ? resultArray : [{ title: "No document..." }];
}

function listDatabases() {
  /* get an array of all databases sorted by name */
  const DBs = app
    .databases()
    .sort((a, b) => (a.name() > b.name() ? 1 : a.name() < b.name() ? -1 : 0));
  const items = DBs.map((db) => {
    return {
      title: db.name(),
      arg: "",
      type: "file",
      variables: { selectedDbUUID: db.uuid(), selectedDbName: db.name() },
    };
  });
  return items;
}

/* Open record in DT, using the UUID passed in arg[0] */
function openRecord(arg) {
  const uuid = checkArg(arg);
  app.openWindowFor({ record: app.getRecordWithUuid(uuid) });
}

/* Find all records with the tag in env('selectedTag'). Uses searchForAlfred. */
function recordsWithTag() {
  const tag = getEnv("selectedTag");
  return searchForAlfred([`tags: ${tag}`]);
}

/* List all smart groups for either the db passed in the environment variable selectedDbUuid or all databases */
function listSmartgroups() {
  const dbs = getDB(true); /* array of database objects to search in */
  const filterOutGroup = getEnv("filterOutGroup");

  const items = [];

  dbs.forEach((db) => {
    // get all smart groups for current db sorted by name
    const smartGroupList = db
      .smartGroups()
      .sort((a, b) => (a.name() > b.name() ? 1 : a.name() < b.name() ? -1 : 0));
    smartGroupList.forEach((sg) => {
      items.push({
        title: sg.name(),
        subtitle: `📂 ${db.name()} (${sg.children().length} elements)`,
        arg: sg.uuid(), // pass on smart groups UUID to next action, i.e. open in DT
      });
    });
  });
  return items.length > 0 ? items : [{ title: "No SmartGroups …" }];
}

/* Open search with query passed in arg in DT */
function searchInDT(arg) {
  const query = checkArg(arg).replace(/(\p{sc=Han}+)/gu, " ~\1 ");
  if (arg.length === 1) {
    curApp.doShellScript(
      `open 'x-devonthink://search?query=${encodeURIComponent(query)}'`
    );
  } else {
    app.activate();
    const r = app.inbox.root();
    const tw = app.openWindowFor({ record: r }, { force: true });
    tw.searchQuery = query;
  }
}

function listFavorites() {
  const se = Application("System Events");

  const supportPath = se.userDomain.applicationSupportFolder.posixPath();

  const plistPath = `${supportPath}/DEVONthink 3/Favorites.plist`;
  const plist = se.propertyListFiles[plistPath];

  const items = plist.propertyListItems().map((it) => {
    const v = it.value();
    if ("UUID" in v) {
      /* Normal record */
      return { title: `📁 v.Name`, arg: v.UUID};
    } else if ("Path" in v) {
      /* Database */
        const uuid = (() => {
        const db = app.openDatabase(v.Path);
        return db.uuid();
      })();
      return { title: v.Name, arg: uuid };
    }
  });
  return items.length
    ? items
    : [{ title: "No favorite items" }];
}

function listWorkspaces() {
  const items = app.workspaces().map((w) => {
    return { title: w, arg: w };
  });
  return items.length ? items : [{ title: "No workspaces" }];
}

function loadWorkspace(argv) {
  const workspace = checkArg(argv);
  app.loadWorkspace(workspace);
  app.activate();
}

function saveWorkspace(argv) {
  const workspace = checkArg(argv);
  Application("DEVONthink 3").saveWorkspace(workspace);
}

function listSearches() {
  loadSearches();
  const items = savedSearches.map(s => {
    const dbString = s.db ||'All databases';
    const scopeString = (s.db ? ` scope:${s.db}`: '');
    return {title: `${s.q} (${dbString})`, arg: `${s.q}${scopeString}`};
  })
  return items.length ? items : [{ title: "No queries saved" }];
}