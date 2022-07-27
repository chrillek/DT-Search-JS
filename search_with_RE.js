/* Search in the currently selected smartgroup   
using the content of the first argument as regular expression 
**BEWARE** THIS CAN TAKE A LOT OF TIME! */

ObjC.import("Foundation");

function run(argv) {
  const query = argv && argv[0] ? argv[0] : "";
  if (query != "") {
    const RE = new RegExp(query);
    const SGUUID = $.NSProcessInfo.processInfo.environment.js["selectedSGUUID"].js;
    const app = Application("DEVONthink 3");
    
    const smartGroup = app.getRecordWithUuid(SGUUID)    

    /* Get all children of the smart group with a non-empty plainText property */
    const records = smartGroup.children.whose({
      _not: [{_match: [ObjectSpecifier().plainText, ""]}]
    })

    const resultArray = [];
    /* Create the result set from all records matching the RE - that's the time consuming part */
    records().filter(r => {
        return RE.test(r.plainText())
      }).forEach( r => {
        
      const itemLocation = (() => {
        return (r.location().length > 1 ? r.location().slice(0,-1).replace(/\//g, " > ") : "");
      })()
        
      const item = {
        type: 'file:skipcheck',
        title: r.name(),
        arg  : r.path(),
        subtitle: `📂 ${r.database.name()} ${itemLocation}`,
        icon: { type: "fileicon", path: r.path()},
      };
      item.text = {
        copy: `x-devonthink-item://${item.uuid}`,
        largetype: `x-devonthink-item://${item.uuid}`,
      };
      item.quicklookurl = item.path;
      resultArray.push(item);
    }); /* forEach */
    const result = resultArray.length
      ? JSON.stringify({ items: resultArray })
      : JSON.stringify({ items: [{ title: "No document..." }] });
    return result;
  } else {
    return JSON.stringify({ items: [{ title: "No document..." }] });
  }
}
